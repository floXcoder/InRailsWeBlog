'use strict';

import {
    fetchArticles
} from '../../actions';

import {
    getArticlePagination,
    getArticles
} from '../../selectors';

import Spinner from '../materialize/spinner';

import ArticleListDisplay from './display/list';
import ArticleSortDisplay from './sort/dropdown';
import ArticleNone from '../articles/display/none';

@connect((state) => ({
    currentUserId: state.userState.currentId,
    currentTopicId: state.topicState.currentTopic && state.topicState.currentTopic.id,
    currentTopicSlug: state.topicState.currentTopic && state.topicState.currentTopic.slug,
    isFetching: state.articleState.isFetching,
    articles: getArticles(state),
    articlePagination: getArticlePagination(state),
    articlesLoaderMode: state.uiState.articlesLoaderMode,
    articleDisplayMode: state.uiState.articleDisplayMode,
    articleEditionId: state.articleState.articleEditionId
}), {
    fetchArticles
})
export default class ArticleIndex extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        queryString: PropTypes.string,
        // From connect
        currentUserId: PropTypes.number,
        currentTopicId: PropTypes.number,
        currentTopicSlug: PropTypes.string,
        isFetching: PropTypes.bool,
        articles: PropTypes.array,
        articlePagination: PropTypes.object,
        articleEditionId: PropTypes.number,
        articlesLoaderMode: PropTypes.string,
        articleDisplayMode: PropTypes.string,
        fetchArticles: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._fetchInitArticles(props.params, props.queryString);
    }

    componentWillReceiveProps(nextProps) {
        if (!Object.equals(this.props.params, nextProps.params) || this.props.queryString !== nextProps.queryString) {
            this._fetchInitArticles(nextProps.params, nextProps.queryString);
        }
    }

    _filterParams = (params = {}) => {
        return {
            userId: params.currentUserId || this.props.currentUserId,
            topicId: params.currentTopicId || this.props.currentTopicId,
            ...params
        };
    };

    _fetchInitArticles = (params, queryString) => {
        const queryParams = Utils.parseUrlParameters(queryString);

        let options = {};
        if (this.props.articlesLoaderMode === 'all') {
            options.limit = 1000;
        }
        this.props.fetchArticles(this._filterParams({params, ...queryParams}), options);
    };

    _fetchNextArticles = (params = {}) => {
        if (this.props.articlePagination && this.props.articlePagination.currentPage < this.props.articlePagination.totalPages) {
            const options = {
                page: (params.selected || this.props.articlePagination.currentPage) + 1
            };

            this.props.fetchArticles(this._filterParams(), options, {infinite: !params.selected})
                .then(() => {
                    if (params.selected) {
                        setTimeout(() => {
                            $('html, body').animate({scrollTop: ReactDOM.findDOMNode(this).getBoundingClientRect().top - 64}, 750);
                        }, 300);
                    }
                });
        }
    };

    render() {
        const hasMoreArticles = this.props.articlePagination && this.props.articlePagination.currentPage < this.props.articlePagination.totalPages;

        return (
            <div className="blog-article-box">
                {
                    this.props.isFetching &&
                    <div className="center margin-top-20">
                        <Spinner size="big"/>
                    </div>
                }

                {
                    this.props.articles.length > 0 &&
                    <ArticleSortDisplay currentTopicSlug={this.props.currentTopicSlug}/>
                }

                {
                    this.props.articles.length > 0 &&
                    <ArticleListDisplay articles={this.props.articles}
                                        articlesLoaderMode={this.props.articlesLoaderMode}
                                        articleDisplayMode={this.props.articleDisplayMode}
                                        articleEditionId={this.props.articleEditionId}
                                        hasMoreArticles={hasMoreArticles}
                                        articleTotalPages={this.props.articlePagination && this.props.articlePagination.totalPages}
                                        fetchArticles={this._fetchNextArticles}/>
                }

                {
                    (this.props.articles.length === 0 && !this.props.isFetching) &&
                    <ArticleNone topicSlug={this.props.params.topicSlug}
                                 isTopicPage={true}
                                 isSearchPage={false}/>
                }
            </div>
        );
    }
}
