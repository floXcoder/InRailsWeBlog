'use strict';

import {
    fetchArticles,
    updateArticleOrder
} from '../../actions';

import {
    getArticlePagination,
    getArticles
} from '../../selectors';

import Loader from '../theme/loader';

import ArticleListDisplay from './display/list';
import ArticleSortDisplay from './sort/dropdown';
import ArticleFilterDisplay from './filter/dropdown';
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
    articleOrderMode: state.uiState.articleOrderMode,
    articleEditionId: state.articleState.articleEditionId
}), {
    fetchArticles,
    updateArticleOrder
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
        articleOrderMode: PropTypes.string,
        fetchArticles: PropTypes.func,
        updateArticleOrder: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._parseQuery = Utils.parseUrlParameters(props.queryString) || {};
        this._request = null;
    }

    componentDidMount() {
        this._fetchArticles(this.props.params);
    }

    componentDidUpdate(prevProps) {
        if (!Object.equals(this.props.params, prevProps.params) || this.props.queryString !== prevProps.queryString) {
            const nextParseQuery = Utils.parseUrlParameters(prevProps.queryString) || {};

            if (this._parseQuery.order !== nextParseQuery.order) {
                if (nextParseQuery.order) {
                    this.props.updateArticleOrder(nextParseQuery.order);
                }
            }

            this._parseQuery = nextParseQuery;

            this._fetchArticles(prevProps.params);
        }
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    _filterParams = (params = {}) => {
        return {
            userId: params.currentUserId || this.props.currentUserId,
            topicId: params.currentTopicId || this.props.currentTopicId,
            ...params
        };
    };

    _fetchArticles = (params) => {
        let options = {};
        if (this.props.articlesLoaderMode === 'all') {
            options.limit = 1000;
        }

        if (params.childTagSlug) {
            params.parentTagSlug = params.tagSlug;
            delete params.tagSlug;
        }

        this._request = this.props.fetchArticles(this._filterParams({...params, ...this._parseQuery}), options);
    };

    _fetchNextArticles = (params = {}) => {
        if (this.props.articlePagination && this.props.articlePagination.currentPage < this.props.articlePagination.totalPages) {
            const queryParams = Utils.parseUrlParameters(this.props.queryString);
            const options = {
                page: (params.selected || this.props.articlePagination.currentPage) + 1
            };

            this._request = this.props.fetchArticles(this._filterParams(queryParams), options, {infinite: !params.selected});

            this._request.fetch.then(() => {
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
        const isSortedByTag = this.props.articleOrderMode === 'tag_asc' || this.props.articleOrderMode === 'tag_desc';

        return (
            <div className="blog-article-box">
                {
                    this.props.isFetching &&
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                }

                {
                    this.props.articles.length > 0 &&
                    <ArticleSortDisplay currentTopicSlug={this.props.currentTopicSlug}
                                        currentOrder={this.props.articleOrderMode}/>
                }

                {
                    this.props.articles.length > 0 &&
                    <ArticleFilterDisplay currentUserId={this.props.currentUserId}/>
                }

                {
                    this.props.articles.length > 0 &&
                    <ArticleListDisplay articles={this.props.articles}
                                        articlesLoaderMode={this.props.articlesLoaderMode}
                                        articleDisplayMode={this.props.articleDisplayMode}
                                        articleEditionId={this.props.articleEditionId}
                                        hasMoreArticles={hasMoreArticles}
                                        isSortedByTag={isSortedByTag}
                                        parentTag={this.props.params.tagSlug}
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
