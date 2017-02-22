'use strict';

const TagActions = require('../../../actions/tagActions');
const TagStore = require('../../../stores/tagStore');

const ArticleCommonField = require('./fields/common');
const ArticleAdvancedField = require('./fields/advanced');
const ArticleErrorField = require('./fields/error');

const Submit = require('../../materialize/submit');

import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';

var ArticleFormDisplay = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        multipleId: React.PropTypes.number,
        children: React.PropTypes.object,
        isTemporary: React.PropTypes.bool,
        articleErrors: React.PropTypes.array,
        onCancel: React.PropTypes.func,
        onSubmit: React.PropTypes.func
    },

    mixins: [
        Reflux.listenTo(TagStore, 'onTagChange')
    ],

    getDefaultProps () {
        return {
            multipleId: null,
            children: null,
            isTemporary: null,
            articleErrors: null,
            onCancel: null,
            onSubmit: null
        };
    },

    getInitialState () {
        return {
            tags: [],
            isValid: false,
            isLink: null,
            submitTooltipMessage: I18n.t('js.article.common.tooltips.title_too_short'),
            isProcessing: false,
            isTemporary: this.props.isTemporary || false
        };
    },

    _commonFields: null,

    componentWillMount () {
        TagActions.loadTags({user_tags: true});
    },

    componentDidUpdate () {
        if (this.state.submitTooltipMessage) {
            $(ReactDOM.findDOMNode(this)).find('input[type="submit"]').each(function () {
                $(this).tooltip();
            });
        } else {
            $(ReactDOM.findDOMNode(this)).find('input[type="submit"]').each(function () {
                $(this).tooltip('remove');
            });
        }
    },

    onTagChange (tagData) {
        if ($.isEmpty(tagData)) {
            return;
        }

        if (tagData.type === 'loadTags') {
            this.setState({
                tags: tagData.tags
            });
        }
    },

    _handleCommonInputsChange (attributes) {
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
    },

    _handleCancelClick (event) {
        event.preventDefault();

        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },

    _handleArticleSubmit (event) {
        event.preventDefault();

        if (this._commonFields) {
            this._commonFields.serialize();
        }

        if (this.props.onSubmit) {
            this.props.onSubmit();
        }

        return true;
    },

    render () {
        const submitIsDisabled = !this.state.isValid && !this.props.articleErrors;

        return (
            <form id={this.props.id}
                  className="article-form"
                  onSubmit={this._handleArticleSubmit}>
                <Card initiallyExpanded={true}>
                    <CardHeader
                        title={<h4 className="blog-form-title">{I18n.t('js.article.new.title')}</h4>}
                        actAsExpander={true}
                        showExpandableButton={true}/>
                    <CardText className="form-editor-card"
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
                                                      isTemporary={this.props.children ? this.props.children.temporary : this.state.isTemporary}
                                                      isLink={this.props.children ? this.props.children.is_link : this.state.isLink}
                                                      tags={this.state.tags}
                                                      multipleId={this.props.multipleId}/>
                            </div>
                        </div>
                    </CardText>

                    <CardActions>
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
                    </CardActions>
                </Card>
            </form>
        );
    }
});

module.exports = ArticleFormDisplay;
