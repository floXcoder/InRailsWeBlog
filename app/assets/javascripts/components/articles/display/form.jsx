'use strict';

import TagActions from '../../../actions/tagActions';
import TagStore from '../../../stores/tagStore';

import ArticleCommonField from './fields/common';
import ArticleAdvancedField from './fields/advanced';
import ArticleErrorField from './fields/error';

import Submit from '../../materialize/submit';

export default class ArticleFormDisplay extends Reflux.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        multipleId: PropTypes.number,
        children: PropTypes.object,
        isDraft: PropTypes.bool,
        articleErrors: PropTypes.array,
        onCancel: PropTypes.func,
        onSubmit: PropTypes.func
    };

    static defaultProps = {
        multipleId: null,
        children: null,
        isDraft: null,
        articleErrors: null,
        onCancel: null,
        onSubmit: null
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(TagStore, this.onTagChange);

        this._commonFields = null;
    }

    state = {
        tags: [],
        isValid: false,
        isLink: null,
        submitTooltipMessage: I18n.t('js.article.common.tooltips.title_too_short'),
        isProcessing: false,
        isDraft: this.props.isDraft || false
    };

    componentWillMount() {
        TagActions.loadTags({user_tags: true});
    }

    componentDidUpdate() {
        if (this.state.submitTooltipMessage) {
            $(ReactDOM.findDOMNode(this)).find('input[type="submit"]').each(function () {
                $(this).tooltip();
            });
        } else {
            $(ReactDOM.findDOMNode(this)).find('input[type="submit"]').each(function () {
                $(this).tooltip('remove');
            });
        }
    }

    onTagChange(tagData) {
        if ($.isEmpty(tagData)) {
            return;
        }

        if (tagData.type === 'loadTags') {
            this.setState({
                tags: tagData.tags
            });
        }
    }

    _handleCommonInputsChange = (attributes) => {
        let isValidArticle = true;
        let submitTooltipMessage = null;
        if (attributes.titleLength < window.parameters.article_title_min_length) {
            isValidArticle = false;
            submitTooltipMessage = I18n.t('js.article.common.tooltips.title_too_short');
        } else if (attributes.summaryLength > 0 && attributes.summaryLength < window.parameters.article_summary_min_length) {
            isValidArticle = false;
            submitTooltipMessage = I18n.t('js.article.common.tooltips.summary_too_short');
        } else if (attributes.contentLength < window.parameters.article_content_min_length) {
            isValidArticle = false;
            submitTooltipMessage = I18n.t('js.article.common.tooltips.content_too_short');
        }

        this.setState({
            isValid: isValidArticle,
            submitTooltipMessage: submitTooltipMessage
        });
    };

    _handleCancelClick = (event) => {
        event.preventDefault();

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    _handleArticleSubmit = (event) => {
        event.preventDefault();

        if (this._commonFields) {
            this._commonFields.serialize();
        }

        if (this.props.onSubmit) {
            this.props.onSubmit();
        }

        return true;
    };

    render() {
        const submitIsDisabled = !this.state.isValid && !this.props.articleErrors;

        return (
            <form id={this.props.id}
                  className="article-form"
                  onSubmit={this._handleArticleSubmit}>
                <div className="card">
                    <h4 className="blog-form-title">{I18n.t('js.article.new.title')}</h4>

                    <div className="form-editor-card"
                              style={{
                                  paddingBottom: 0,
                                  paddingTop: 0
                              }}>
                        <div className="row">
                            {
                                this.props.articleErrors &&
                                <div className="col s12">
                                    <ArticleErrorField errors={this.props.articleErrors}/>
                                </div>
                            }

                            <div className="col s12">
                                <ArticleCommonField ref={(commonFields) => this._commonFields = commonFields}
                                                    article={this.props.children || {}}
                                                    onInputsChange={this._handleCommonInputsChange}/>
                            </div>

                            <div className="col s12 margin-top-10">
                                <ArticleAdvancedField article={this.props.children || {}}
                                                      isDraft={this.props.children ? this.props.children.draft : this.state.isDraft}
                                                      tags={this.state.tags}
                                                      multipleId={this.props.multipleId}/>
                            </div>
                        </div>
                    </div>

                    <div className="card-action">
                        <div className="row">
                            <div className="col s6 left-align">
                                <a className="waves-effect waves-teal btn-flat"
                                   onClick={this._handleCancelClick}>
                                    {I18n.t('js.buttons.cancel')}
                                </a>
                            </div>

                            <div className="col s6 right-align">
                                <Submit id="article-submit"
                                        icon="send"
                                        isDisabled={submitIsDisabled}
                                        tooltipMessage={this.state.submitTooltipMessage}
                                        onClick={this._handleArticleSubmit}>
                                    {I18n.t('js.article.new.submit')}
                                </Submit>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
