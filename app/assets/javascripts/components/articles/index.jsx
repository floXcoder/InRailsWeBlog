'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    Suspense
} from 'react';

import {
    parse
} from 'qs';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    ArticleShow,
    ArticleListMode,
    ArticleInfiniteMode,
    ArticleMasonryMode,
    ArticleTimelineMode
} from '../loaders/components';

import {
    fetchArticles,
    updateArticleOrderDisplay,
    setCurrentArticles,
    setCurrentTags
} from '../../actions';

import {
    getArticleMetaTags,
    getArticlesCurrentMode,
    getArticlesCount,
    getArticlePagination,
    getStoryTopic
} from '../../selectors';

import Loader from '../theme/loader';
import Pagination from '../theme/pagination';

import HeadLayout from '../layouts/head';

import SummaryStoriesTopic from '../topics/stories/summary';

import ArticleNoneDisplay from './display/items/none';

import styles from '../../../jss/article/index';

export default @connect((state) => ({
    metaTags: getArticleMetaTags(state),
    userId: state.userState.currentId,
    userSlug: state.userState.currentSlug,
    storyTopic: getStoryTopic(state),
    isFetching: state.articleState.isFetching,
    articlesCount: getArticlesCount(state),
    articlePagination: getArticlePagination(state),
    articleCurrentMode: getArticlesCurrentMode(state),
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
@hot
@withStyles(styles)
class ArticleIndex extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        routeHash: PropTypes.string,
        // from connect
        metaTags: PropTypes.object,
        userId: PropTypes.number,
        userSlug: PropTypes.string,
        storyTopic: PropTypes.object,
        isFetching: PropTypes.bool,
        articlesCount: PropTypes.number,
        articleCurrentMode: PropTypes.string,
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

        this._parseQuery = parse(props.routeHash);
        this._request = null;
        this._isFetchingNext = false;
        this._articles = React.createRef();
    }

    componentDidMount() {
        this._fetchArticles();

        setTimeout(() => ArticleShow.preload(), 5000);
    }

    componentDidUpdate(prevProps) {
        // Manage articles order or sort display
        if (!Object.equals(this.props.routeParams, prevProps.routeParams) || this.props.routeHash !== prevProps.routeHash) {
            const nextParseQuery = parse(this.props.routeHash);

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

        if (this.props.routeParams.userSlug) {
            queryParams.userSlug = this.props.routeParams.userSlug;
        }

        if (this.props.routeParams.topicSlug) {
            queryParams.topicSlug = this.props.routeParams.topicSlug;
        }

        if (this.props.routeParams.childTagSlug) {
            queryParams.parentTagSlug = this.props.routeParams.tagSlug;
            queryParams.childTagSlug = this.props.routeParams.childTagSlug;
        } else if (this.props.routeParams.tagSlug) {
            queryParams.tagSlug = this.props.routeParams.tagSlug;
        }

        if (this.props.routeParams.sharedTopic) {
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

        this._request.fetch.then(() => this.props.routeParams.tagSlug && this.props.setCurrentTags([this.props.routeParams.tagSlug, this.props.routeParams.childTagSlug]));
    };

    _fetchNextArticles = (params = {}) => {
        if (this.props.articlePagination && this.props.articlePagination.currentPage <= this.props.articlePagination.totalPages) {
            const queryParams = parse(this.props.routeHash);
            const options = {
                page: (params.selected || this.props.articlePagination.currentPage) + 1
            };

            this._isFetchingNext = true;

            this._request = this.props.fetchArticles({
                userId: this.props.userId,
                ...this._formatParams(),
                ...queryParams
            }, options, {infinite: !params.selected});

            this._request.fetch.then(() => {
                this._isFetchingNext = false;

                if (params.selected) {
                    window.scroll({top: this._articles.current.getBoundingClientRect().top - 64, behavior: 'smooth'});
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
        if (this.props.articlesCount === 0 && !this.props.isFetching) {
            return (
                <div className="blog-article-box">
                    <ArticleNoneDisplay userSlug={this.props.routeParams.userSlug}
                                        topicSlug={this.props.routeParams.topicSlug}
                                        tagSlug={this.props.routeParams.tagSlug}
                                        childTagSlug={this.props.routeParams.childTagSlug}
                                        isTopicPage={true}
                                        isSearchPage={false}/>
                </div>
            );
        }

        const hasMoreArticles = this.props.articlePagination && this.props.articlePagination.currentPage < this.props.articlePagination.totalPages;

        const isGridDisplay = this.props.articleDisplayMode === 'grid';
        const isInfiniteDisplay = this.props.articlesLoaderMode === 'infinite';

        const isLargeContainer = isGridDisplay || this.props.articleCurrentMode === 'stories';
        const isFullContainer = this.props.articleCurrentMode === 'stories' || this.props.articleCurrentMode === 'inventories';

        let ArticleNodes;
        if (this.props.articleCurrentMode === 'stories') {
            ArticleNodes = (
                <ArticleTimelineMode onEnter={this._handleArticleEnter}
                                     onExit={this._handleArticleExit}/>
            );
        } else if (isGridDisplay) {
            ArticleNodes = (
                <ArticleMasonryMode onEnter={this._handleArticleEnter}
                                    onExit={this._handleArticleExit}/>
            );
        } else {
            ArticleNodes = (
                <ArticleListMode parentTag={this.props.routeParams.tagSlug}
                                 isMinimized={this.props.areArticlesMinimized}
                                 articleEditionId={this.props.articleEditionId}
                                 onEnter={this._handleArticleEnter}
                                 onExit={this._handleArticleExit}/>
            );
        }

        return (
            <div ref={this._articles}>
                {
                    this.props.articleCurrentMode === 'stories' && this.props.storyTopic &&
                    <SummaryStoriesTopic topic={this.props.storyTopic}/>
                }

                <div className={classNames(this.props.classes.articleIndex, {
                    [this.props.classes.largeContainer]: isLargeContainer,
                    [this.props.classes.fullContainer]: isFullContainer
                })}>
                    <HeadLayout metaTags={this.props.metaTags}/>

                    {
                        this.props.isFetching &&
                        <div className={this.props.classes.articleIndex}>
                            <div className="center">
                                <Loader size="big"/>
                            </div>
                        </div>
                    }

                    {
                        this.props.articlesCount > 0 &&
                        <Suspense fallback={<div/>}>
                            {
                                (!this.props.isFetching || this._isFetchingNext) && (
                                    isInfiniteDisplay
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
