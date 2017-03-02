'use strict';

import ArticleActions from '../../actions/articleActions';
import ArticleStore from '../../stores/articleStore';

import ArticleFormDisplay from './display/form';

require('../../modules/validation');
require('jquery-serializejson');

export default class ArticleEdit extends Reflux.Component {
    static propTypes = {
        article: React.PropTypes.object,
        multipleId: React.PropTypes.number,
        params: React.PropTypes.object
    };

    static childContextTypes = {
        router: React.PropTypes.object
    };

    static defaultProps = {
        article: null,
        multipleId: null,
        params: {}
    };

    state = {
        article: null,
        articleErrors: null
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(ArticleStore, this.onArticleChange);
    }

    componentWillMount() {
        if (this.props.article) {
            this.setState({
                article: this.props.article
            })
        } else if (this.props.params.articleSlug) {
            ArticleActions.loadArticle({slug: this.props.params.articleSlug});
        }
    }

    onArticleChange(articleData) {
        if ($.isEmpty(articleData)) {
            return;
        }

        let newState = {};

        if (articleData.type === 'loadArticle') {
            newState.article = articleData.article;
        }

        if (articleData.type === 'updateArticle') {
            this.context.router.push(`/article/${articleData.article.slug}`);
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

    _onCancel() {
        if (this.state.article) {
            this.context.router.push(`/article/${this.state.article.id}`);
        } else {
            this.context.router.push('/');
        }
        return true;
    }

    _handleArticleSubmit() {
        const $articleForm = $('#article-edit' + (this.props.multipleId ? '-' + this.props.multipleId : '' ));

        const validator = $articleForm.parsley();

        if (!validator.isValid()) {
            validator.validate();
            Materialize.toast(I18n.t('js.article.common.validation_error.common'), 5000);
            return false;
        }

        let currentArticle = $articleForm.serializeJSON().article;

        ArticleActions.updateArticle(currentArticle);

        return true;
    }

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
