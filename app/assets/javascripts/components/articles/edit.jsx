'use strict';

import {
    Link
} from 'react-router-dom';

import {
    fetchArticle,
    updateArticle
} from '../../actions';

import {
    getTags,
    getCurrentUser,
    getCurrentTopic,
    getArticleErrors
} from '../../selectors';

import {
    formatTagArticles
} from '../../forms/article';

import Spinner from '../materialize/spinner';

import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleFormDisplay from './display/form';

@connect((state) => ({
    isFetching: state.articleState.isFetching,
    article: state.articleState.article,
    tags: getTags(state),
    currentUser: getCurrentUser(state),
    currentTopic: getCurrentTopic(state),
    articleErrors: getArticleErrors(state)
}), {
    fetchArticle,
    updateArticle
})
export default class ArticleEdit extends React.PureComponent {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        multipleId: PropTypes.number,
        // from connect
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        tags: PropTypes.array,
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        articleErrors: PropTypes.array,
        fetchArticle: PropTypes.func,
        updateArticle: PropTypes.func
    };

    constructor(props) {
        super(props);

        props.fetchArticle(props.params.articleSlug);
    }

    _handleSubmit = (values) => {
        let formData = values.toJS();

        formData.id = this.props.article.id;

        formatTagArticles(formData, this.props.article.tags.toArray(), this.props.article.parentTagIds, this.props.article.childTagIds);

        this.props.updateArticle(formData)
            .then((response) => {
                if (response.article) {
                    this.props.history.push({
                        pathname: `/article/${response.article.slug}`,
                        state: {reloadTags: true}
                    });
                }
            });

        return true;
    };

    render() {
        if (!this.props.article) {
            return (
                <div className="center margin-top-20">
                    <Spinner size="big"/>
                </div>
            );
        }

        return (
            <div className="blog-form blog-article-edit">
                <div className="blog-breadcrumb">
                    {
                        (this.props.currentUser && this.props.currentTopic) &&
                        <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                                  topic={this.props.currentTopic}
                                                  article={this.props.article}/>
                    }
                </div>

                <ArticleFormDisplay id={`article-edit-${this.props.article.id}`}
                                    currentMode={this.props.article.mode}
                                    isDraft={this.props.article.isDraft}
                                    articleErrors={this.props.articleErrors}
                                    onSubmit={this._handleSubmit}>
                    {this.props.article}
                </ArticleFormDisplay>
            </div>
        );
    }
}
