'use strict';

import {
    updateArticle
} from '../../actions';

import ArticleFormDisplay from './display/form';

@connect(null, {
    updateArticle
})
export default class ArticleEdit extends React.PureComponent {
    static propTypes = {
        article: PropTypes.object,
        multipleId: PropTypes.number,
        // from connect
        updateArticle: PropTypes.func
    };

    constructor(props) {
        super(props);

        // TODO
        // if (props.article) {
        //     this.state.article = props.article;
        // } else if (props.params.articleSlug) {
        //     ArticleActions.loadArticle({slug: this.props.params.articleSlug});
        // }
    }

    // TODO: get from redux
    // state = {
    //     articleErrors: undefined
    // };

    _onCancel = () => {
        // TODO
        // if (this.state.article) {
        //     this.props.history.push(`/article/${this.state.article.id}`);
        // } else {
        //     this.props.history.push('/');
        // }
    };

    _handleSubmit = () => {
        this.props.updateArticle(values.toJS());

        return true;
    };

    render() {
        if (!this.props.article) {
            return null;
        }

        const articleFormId = 'article-edit' + (this.props.multipleId ? '-' + this.props.multipleId : '');

        return (
            <div className="blog-form blog-article-edit">
                <div className="card">
                    <div className="card-content blue-grey darken-3 white-text">
                            <span className="card-title">
                                {
                                    this.props.article.title
                                        ?
                                        I18n.t('js.article.edit.form_title', {title: this.props.article.title})
                                        :
                                        I18n.t('js.article.edit.title')
                                }
                            </span>
                    </div>

                    <div className="card-action">
                        <ArticleFormDisplay id={articleFormId}
                                            onSubmit={this._handleSubmit}
                                            onCancel={this._onCancel}
                                            articleErrors={this.props.articleErrors}>
                            {this.props.article}
                        </ArticleFormDisplay>
                    </div>
                </div>
            </div>
        );
    }
}
