'use strict';

import {
    reduxForm
} from 'redux-form/immutable';

import {
    Link
} from 'react-router-dom';

import {
    fetchTags
} from '../../../actions';

import {
    getCategorizedTags
} from '../../../selectors';

import ArticleCommonField from './fields/common';
import ArticleAdvancedField from './fields/advanced';
import ArticleErrorField from './fields/error';

import Submit from '../../materialize/submit';

const validate = (values) => {
    const errors = {};

    const title = values.get('title');
    if (title) {
        // I18n.t('js.article.common.tooltips.title_too_short');
        if (title.length < window.settings.article_title_min_length || title.length > window.settings.article_title_max_length) {
            errors.title = I18n.t('js.article.errors.title.size', {
                min: window.settings.article_title_min_length,
                max: window.settings.article_title_max_length
            });
        }
    }

    const summary = values.get('summary');
    if (summary) {
        // I18n.t('js.article.common.tooltips.summary_too_short');
        if (summary.length < window.settings.article_summary_min_length || summary.length > window.settings.article_summary_max_length) {
            errors.summary = I18n.t('js.article.errors.summary.size', {
                min: window.settings.article_summary_min_length,
                max: window.settings.article_summary_max_length
            });
        }
    }

    let content = values.get('content');
    if (content) {
        content = content.replace(/<(?:.|\n)*?>/gm, '');
        if (content.length < window.settings.article_content_min_length || content.length > window.settings.article_content_max_length) {
            errors.content = I18n.t('js.article.errors.content.size', {
                min: window.settings.article_content_min_length,
                max: window.settings.article_content_max_length
            });
        }
    } else {
        errors.content = I18n.t('js.article.common.tooltips.content_too_short');
    }

    return errors;
};

@reduxForm({
    form: 'article',
    validate
})
@connect((state) => ({
    tags: getCategorizedTags(state)
}), {
    fetchTags
})
export default class ArticleFormDisplay extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        multipleId: PropTypes.number,
        children: PropTypes.object,
        isDraft: PropTypes.bool,
        articleErrors: PropTypes.array,
        // from reduxForm
        handleSubmit: PropTypes.func,
        submitting: PropTypes.bool,
        invalid: PropTypes.bool,
        // from connect
        tags: PropTypes.array,
        fetchTags: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.props.fetchTags({userTags: true});
    }

    state = {
        isLink: false,
        isDraft: this.props.isDraft || false
    };

    render() {
        return (
            <form id={this.props.id}
                  className="article-form"
                  onSubmit={this.props.handleSubmit}>
                <div className="card">
                    <h4 className="blog-form-title">{I18n.t('js.article.new.title')}</h4>

                    <div className="form-editor-card">
                        <div className="row">
                            {
                                this.props.articleErrors &&
                                <div className="col s12">
                                    <ArticleErrorField errors={this.props.articleErrors}/>
                                </div>
                            }

                            <div className="col s12">
                                <ArticleCommonField article={this.props.children}/>
                            </div>

                            <div className="col s12 margin-top-10">
                                <ArticleAdvancedField article={this.props.children}
                                                      isDraft={this.props.children ? this.props.children.draft : this.state.isDraft}
                                                      tags={this.props.tags}
                                                      multipleId={this.props.multipleId}/>
                            </div>
                        </div>
                    </div>

                    <div className="card-action">
                        <div className="row">
                            <div className="col s6 left-align">
                                <Link className="btn-flat waves-effect waves-teal"
                                      to="/">
                                    {I18n.t('js.helpers.buttons.cancel')}
                                </Link>
                            </div>

                            <div className="col s6 right-align">
                                <Submit id="article-submit"
                                        icon="send"
                                        disabled={this.props.submitting}
                                        onSubmit={this.props.handleSubmit}>
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
