'use strict';

import {
    withRouter
} from 'react-router-dom';

// TODO
// import ArticleActions from '../../actions/articleActions';
// import ArticleStore from '../../stores/articleStore';

import ArticleFormDisplay from './display/form';

import '../../modules/validation';
import 'jquery-serializejson';

@withRouter
export default class ArticleEdit extends React.Component {
    static propTypes = {
        history: PropTypes.func.isRequired,
        article: PropTypes.object,
        multipleId: PropTypes.number,
        params: PropTypes.object
    };

    static defaultProps = {
        params: {}
    };

    constructor(props) {
        super(props);

        // TODO
        // this.mapStoreToState(ArticleStore, this.onArticleChange);

        if (this.props.article) {
            this.state.article = props.article;
        } else if (props.params.articleSlug) {
            // TODO
            // ArticleActions.loadArticle({slug: this.props.params.articleSlug});
        }
    }

    state = {
        article: undefined,
        articleErrors: undefined
    };

    onArticleChange(articleData) {
        if ($.isEmpty(articleData)) {
            return;
        }

        let newState = {};

        if (articleData.type === 'loadArticle') {
            newState.article = articleData.article;
        }

        if (articleData.type === 'updateArticle') {
            this.props.history.push(`/article/${articleData.article.slug}`);
        }

        if (articleData.type === 'updateArticleError') {
            newState.articleErrors = Object.keys(articleData.articleErrors).map((errorName) => {
                let errorDescription = articleData.articleErrors[errorName];
                return I18n.t('js.article.model.' + errorName) + ' ' + errorDescription.join(I18n.t('js.helpers.and'));
            });
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    _onCancel = () => {
        if (this.state.article) {
            this.props.history.push(`/article/${this.state.article.id}`);
        } else {
            this.props.history.push('/');
        }
        return true;
    };

    _handleArticleSubmit = () => {
        const $articleForm = $('#article-edit' + (this.props.multipleId ? '-' + this.props.multipleId : '' ));

        const validator = $articleForm.parsley();

        if (!validator.isValid()) {
            validator.validate();
            Notification.error(I18n.t('js.article.common.validation_error.common'));
            return false;
        }

        let currentArticle = $articleForm.serializeJSON().article;

        // TODO
        // ArticleActions.updateArticle(currentArticle);

        return true;
    };

    render() {
        const articleFormId = 'article-edit' + (this.props.multipleId ? '-' + this.props.multipleId : '' );

        if (this.state.article) {
            return (
                <div className="blog-form blog-article-edit">
                    <div className="card">
                        <div className="card-content blue-grey darken-3 white-text">
                            <span className="card-title">
                                {
                                    this.state.article.title
                                        ?
                                        I18n.t('js.article.edit.form_title', {title: this.state.article.title})
                                        :
                                        I18n.t('js.article.edit.title')
                                }
                            </span>
                        </div>

                        <div className="card-action">
                            <ArticleFormDisplay id={articleFormId}
                                                onSubmit={this._handleArticleSubmit}
                                                onCancel={this._onCancel}
                                                articleErrors={this.state.articleErrors}>
                                {this.state.article}
                            </ArticleFormDisplay>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}
