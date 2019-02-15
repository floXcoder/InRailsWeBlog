'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    lazy,
    Suspense
} from 'react';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    fetchArticles,
    updateArticleOrderDisplay,
    setCurrentArticles,
    setCurrentTags
} from '../../actions';

import {
    getArticleMetaTags,
    getArticlesCount,
    getArticlePagination
} from '../../selectors';

import Loader from '../theme/loader';
import Pagination from '../theme/pagination';

import HeadLayout from '../layouts/head';

import SummaryStoriesTopic from '../topics/stories/summary';

import ArticleNoneDisplay from './display/none';

const ArticleListMode = lazy(() => import(/* webpackChunkName: "article-index-list" */ './display/modes/list'));
const ArticleInfiniteMode = lazy(() => import(/* webpackChunkName: "article-index-infinite" */ './display/modes/infinite'));
const ArticleMasonryMode = lazy(() => import(/* webpackChunkName: "article-index-masonry" */ './display/modes/masonry'));
const ArticleTimelineMode = lazy(() => import(/* webpackChunkName: "article-index-timeline" */ './display/modes/timeline'));

import styles from '../../../jss/article/index';

export default @connect((state) => ({
    metaTags: getArticleMetaTags(state),
    userId: state.userState.currentId,
    userSlug: state.userState.currentSlug,
    currentUserTopic: state.topicState.currentTopic,
    isFetching: state.articleState.isFetching,
    articlesCount: getArticlesCount(state),
    articlePagination: getArticlePagination(state),
    articlesLoaderMode: state.uiState.articlesLoaderMode,
    articleDisplayMode: state.uiState.articleDisplayMode,
    areArticlesMinimized: state.uiState.areArticlesMinimized,
    articleEditionId: state.articleState.articleEditionId
}), {
    fetchArticles,
    updateArticleOrderDisplay,
    setCurrentArticles,
    setCurrentTags
})
@hot(module)
@withStyles(styles)
class ArticleIndex extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        queryString: PropTypes.string,
        // from connect
        metaTags: PropTypes.object,
        userId: PropTypes.number,
        userSlug: PropTypes.string,
        currentUserTopic: PropTypes.object,
        isFetching: PropTypes.bool,
        articlesCount: PropTypes.number,
        articlePagination: PropTypes.object,
        articleEditionId: PropTypes.number,
        articlesLoaderMode: PropTypes.string,
        articleDisplayMode: PropTypes.string,
        areArticlesMinimized: PropTypes.bool,
        fetchArticles: PropTypes.func,
        updateArticleOrderDisplay: PropTypes.func,
        setCurrentArticles: PropTypes.func,
        setCurrentTags: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._parseQuery = Utils.parseUrlParameters(props.queryString) || {};
        this._request = null;
    }

    componentDidMount() {
        this._fetchArticles();
    }

    componentDidUpdate(prevProps) {
        // Manage articles order or sort display
        if (!Object.equals(this.props.params, prevProps.params) || this.props.queryString !== prevProps.queryString) {
            const nextParseQuery = Utils.parseUrlParameters(this.props.queryString) || {};

            if (this._parseQuery.order !== nextParseQuery.order) {
                if (nextParseQuery.order) {
                    this.props.updateArticleOrderDisplay(nextParseQuery.order);
                }
            }

            this._parseQuery = nextParseQuery;

            this._fetchArticles();
        } else if (this.props.articleDisplayMode !== prevProps.articleDisplayMode || this.props.articlesLoaderMode !== prevProps.articlesLoaderMode) {
            // Reload articles to fit with new loader or display mode
            this._fetchArticles();
        }
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    _formatParams = () => {
        let queryParams = {};

        if (this.props.params.userSlug) {
            queryParams.userSlug = this.props.params.userSlug;
        }

        if (this.props.params.topicSlug) {
            queryParams.topicSlug = this.props.params.topicSlug;
        }

        if (this.props.params.childTagSlug) {
            queryParams.parentTagSlug = this.props.params.tagSlug;
            queryParams.childTagSlug = this.props.params.childTagSlug;
        } else if (this.props.params.tagSlug) {
            queryParams.tagSlug = this.props.params.tagSlug;
        }

        if (this.props.params['0'] === 'shared-topics') {
            queryParams.sharedTopic = true;
        }

        return queryParams;
    };

    _fetchArticles = () => {
        let options = {};
        if (this.props.articlesLoaderMode === 'all') {
            options.limit = 1000;
        }

        this._request = this.props.fetchArticles({
            userId: this.props.userId,
            ...this._formatParams(),
            ...this._parseQuery
        }, options);

        this._request.fetch.then(() => this.props.params.tagSlug && this.props.setCurrentTags([this.props.params.tagSlug, this.props.params.childTagSlug]));
    };

    _fetchNextArticles = (params = {}) => {
        if (this.props.articlePagination && this.props.articlePagination.currentPage <= this.props.articlePagination.totalPages) {
            const queryParams = Utils.parseUrlParameters(this.props.queryString);
            const options = {
                page: (params.selected || this.props.articlePagination.currentPage) + 1
            };

            this._request = this.props.fetchArticles({
                userId: this.props.userId,
                ...this._formatParams(),
                ...queryParams
            }, options, {infinite: !params.selected});

            this._request.fetch.then(() => {
                if (params.selected) {
                    $('html, body').animate({scrollTop: ReactDOM.findDOMNode(this).getBoundingClientRect().top - 64}, 350);
                }
            });
        }
    };

    _handleArticleEnter = (article) => {
        this.props.setCurrentArticles('add', article.id);
    };

    _handleArticleExit = (article) => {
        this.props.setCurrentArticles('remove', article.id);
    };

    render() {
        const hasMoreArticles = this.props.articlePagination && this.props.articlePagination.currentPage < this.props.articlePagination.totalPages;

        const isStoriesMode = this.props.currentUserTopic && this.props.currentUserTopic.mode === 'stories';

        if (this.props.userId && !this.props.currentUserTopic) {
            return (
                <div className={this.props.classes.root}>
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                </div>
            );
        }

        if (this.props.articlesCount === 0 && !this.props.isFetching) {
            return (
                <div className="blog-article-box">
                    <ArticleNoneDisplay userSlug={this.props.params.userSlug}
                                        topicSlug={this.props.params.topicSlug}
                                        tagSlug={this.props.params.tagSlug}
                                        childTagSlug={this.props.params.childTagSlug}
                                        isTopicPage={true}
                                        isSearchPage={false}/>
                </div>
            );
        }

        let ArticleNodes;
        if (isStoriesMode) {
            ArticleNodes = (
                <ArticleTimelineMode onEnter={this._handleArticleEnter}
                                     onExit={this._handleArticleExit}/>
            );
        } else if (this.props.articleDisplayMode === 'grid') {
            ArticleNodes = (
                <ArticleMasonryMode onEnter={this._handleArticleEnter}
                                    onExit={this._handleArticleExit}/>
            );
        } else {
            ArticleNodes = (
                <ArticleListMode classes={this.props.classes}
                                 parentTag={this.props.params.tagSlug}
                                 isMinimized={this.props.areArticlesMinimized}
                                 articleEditionId={this.props.articleEditionId}
                                 onEnter={this._handleArticleEnter}
                                 onExit={this._handleArticleExit}/>
            );
        }

        return (
            <div>
                {
                    (this.props.currentUserTopic && this.props.currentUserTopic.mode === 'stories') &&
                    <SummaryStoriesTopic topic={this.props.currentUserTopic}/>
                }

                <div className={classNames(this.props.classes.root, {
                    [this.props.classes.largeContainer]: this.props.articleDisplayMode === 'grid' || isStoriesMode,
                    [this.props.classes.fullContainer]: isStoriesMode
                })}>
                    <HeadLayout metaTags={this.props.metaTags}/>

                    {
                        this.props.isFetching &&
                        <div className={this.props.classes.root}>
                            <div className="center">
                                <Loader size="big"/>
                            </div>
                        </div>
                    }

                    {
                        this.props.articlesCount > 0 &&
                        <Suspense fallback={<div/>}>
                            {
                                !this.props.isFetching && (
                                    this.props.articlesLoaderMode === 'infinite'
                                        ?
                                        <ArticleInfiniteMode classes={this.props.classes}
                                                             articlesCount={this.props.articlesCount}
                                                             hasMoreArticles={hasMoreArticles}
                                                             fetchArticles={this._fetchNextArticles}>
                                            {ArticleNodes}
                                        </ArticleInfiniteMode>
                                        :
                                        ArticleNodes
                                )
                            }
                        </Suspense>
                    }

                    {
                        this.props.articlesLoaderMode === 'pagination' &&
                        <Pagination totalPages={this.props.articlePagination && this.props.articlePagination.totalPages}
                                    onPaginationClick={this._fetchNextArticles}/>
                    }
                </div>
            </div>
        );
    }
}
