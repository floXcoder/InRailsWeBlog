'use strict';

import {
    reduxForm
} from 'redux-form/immutable';

import {
    Link,
    Prompt
} from 'react-router-dom';

import {
    fetchTags
} from '../../../actions';

import {
    getCategorizedTags,
    getArticleParentTags,
    getArticleChildTags,
    getCurrentTopicVisibility
} from '../../../selectors';

import {
    validateArticle
} from '../../../forms/article';

import {
    Accordion,
    AccordionItem
} from '../../theme/accordion';

import ArticleModeField from './fields/mode';
import ArticleCommonField from './fields/common';
import ArticleAdvancedField from './fields/advanced';
import ArticleErrorField from './fields/error';

import Submit from '../../materialize/submit';

@reduxForm({
    form: 'article',
    validateArticle
})
@connect((state, props) => ({
    userTags: getCategorizedTags(state),
    parentTags: getArticleParentTags(props.children),
    childTags: getArticleChildTags(props.children),
    defaultVisibility: getCurrentTopicVisibility(state)
}), {
    fetchTags
})
export default class ArticleFormDisplay extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        multipleId: PropTypes.number,
        isInline: PropTypes.bool,
        isEditing: PropTypes.bool,
        children: PropTypes.object,
        hasModeSelection: PropTypes.bool,
        currentMode: PropTypes.string,
        isDraft: PropTypes.bool,
        articleErrors: PropTypes.array,
        // From reduxForm
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        submitSucceeded: PropTypes.bool,
        invalid: PropTypes.bool,
        dirty: PropTypes.bool,
        // From connect
        userTags: PropTypes.array,
        parentTags: PropTypes.array,
        childTags: PropTypes.array,
        defaultVisibility: PropTypes.string,
        fetchTags: PropTypes.func
    };

    static defaultProps = {
        isInline: false,
        isEditing: false,
        children: {},
        hasModeSelection: true,
        currentMode: 'story',
        isDraft: false
    };

    constructor(props) {
        super(props);

        if (props.userTags.length === 0) {
            props.fetchTags({userTags: true});
        }
    }

    state = {
        isLink: false,
        isDraft: this.props.isDraft || false,
        currentMode: this.props.children.mode || this.props.currentMode
    };

    _handleModeClick = (mode, event) => {
        event.preventDefault();

        this.setState({
            currentMode: mode
        })
    };

    render() {
        return (
            <form id={this.props.id}
                  className="article-form"
                  onSubmit={this.props.handleSubmit}>
                <Prompt
                    when={this.props.dirty && !this.props.submitSucceeded}
                    message={location => I18n.t('js.article.form.unsaved', {location: location.pathname})}/>

                <div className="card">
                    <h4 className="blog-form-title">
                        {
                            this.props.isEditing
                                ?
                                I18n.t('js.article.edit.title')
                                :
                                I18n.t('js.article.new.title')
                        }
                    </h4>

                    {
                        this.props.hasModeSelection &&
                        <ArticleModeField currentMode={this.state.currentMode}
                                          onModeClick={this._handleModeClick}/>
                    }

                    <div className="form-editor-card">
                        <div className="row">
                            {
                                this.props.articleErrors &&
                                <div className="col s12">
                                    <ArticleErrorField errors={this.props.articleErrors}/>
                                </div>
                            }

                            <div className="col s12">
                                <ArticleCommonField currentMode={this.state.currentMode}
                                                    onSubmit={this.props.handleSubmit}
                                                    article={this.props.children}
                                                    isDraft={this.props.isDraft}
                                                    userTags={this.props.userTags}
                                                    parentTags={this.props.parentTags}
                                                    childTags={this.props.childTags}/>
                            </div>

                            <div className="col s12 margin-top-10">
                                <Accordion>
                                    <AccordionItem title={I18n.t('js.article.common.advanced')}
                                                   isOpen={false}>
                                        <ArticleAdvancedField currentMode={this.state.currentMode}
                                                              articleReference={this.props.children.reference}
                                                              articleVisibility={this.props.children.visibility}
                                                              articleAllowComment={this.props.children.allowComment}
                                                              articleLanguage={this.props.children.currentLanguage}
                                                              defaultVisibility={this.props.defaultVisibility}
                                                              multipleId={this.props.multipleId}/>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>

                    <div className="card-action">
                        <div className="row">
                            <div className="col s6 left-align">
                                <Link className="btn-flat waves-effect waves-teal"
                                      to={this.props.isEditing ? `/article/${this.props.children.slug}` : '/'}>
                                    {I18n.t('js.helpers.buttons.cancel')}
                                </Link>
                            </div>

                            <div className="col s6 right-align">
                                <Submit id="article-submit"
                                        icon="send"
                                        disabled={this.props.submitting}
                                        onSubmit={this.props.handleSubmit}>
                                    {
                                        this.props.isEditing
                                            ?
                                            I18n.t('js.article.edit.submit')
                                            :
                                            I18n.t('js.article.new.submit')
                                    }
                                </Submit>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
