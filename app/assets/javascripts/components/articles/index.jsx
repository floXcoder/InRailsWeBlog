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
    getArticlesCurrentMode,
    getArticlesCount
} from '../../selectors';

import {
    headerMargin,
    articlePreloadShow
} from '../modules/constants';

import Loader from '../theme/loader';
import Pagination from '../theme/pagination';

import NotFound from '../layouts/notFound';

import SummaryStoriesTopic from '../topics/stories/summary';

import ArticleRecommendationDisplay from './display/recommendation';
import ArticleNoneDisplay from './display/items/none';

import styles from '../../../jss/article/index';

export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    currentTopic: state.topicState.currentTopic,
    userSlug: state.userState.currentSlug,
    storyTopic: state.topicState.storyTopic,
    currentState: state.articleState.currentState.value,
    articlesCount: getArticlesCount(state),
    articlePagination: state.articleState.pagination,
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
        initProps: PropTypes.object,
        // from connect
        currentUserId: PropTypes.number,
        currentTopic: PropTypes.object,
        userSlug: PropTypes.string,
        storyTopic: PropTypes.object,
        currentState: PropTypes.string,
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

        this._request = null;
        this._articles = React.createRef();
    }

    componentDidMount() {
        // Use URL params for initial load
        const urlParams = parse(window.location.search.substring(1));

        // Wait for topic is loaded before fetching article (avoid double fetching)
        if (this.props.currentUserId) {
            if (this.props.currentTopic) {
                this._fetchArticles(urlParams);
            }
        } else {
            this._fetchArticles(urlParams);
        }

        setTimeout(() => ArticleShow.preload(), articlePreloadShow);
    }

    componentDidUpdate(prevProps) {
        // Manage articles order or sort display
        if (!Object.equals(this.props.routeParams, prevProps.routeParams) || this.props.routeHash !== prevProps.routeHash) {
            if (prevProps.routeParams.order !== this.props.routeParams.order) {
                if (this.props.routeParams.order) {
                    this.props.updateArticleOrderDisplay(this.props.routeParams.order);
                }
            }

            this._fetchArticles();
        } else if (this.props.currentUserId && !prevProps.currentTopic && this.props.currentTopic) {
            this._fetchArticles();
        } else if (this.props.articleDisplayMode !== prevProps.articleDisplayMode || this.props.articlesLoaderMode !== prevProps.articlesLoaderMode) {
            // Reload articles to fit with new loader or display mode
            this._fetchArticles();
        }
    }

    componentWillUnmount() {
        if (this._request?.signal) {
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

        if (this.props.routeParams.order) {
            queryParams.order = this.props.routeParams.order;
        }

        if (this.props.routeParams.sharedTopic) {
            queryParams.sharedTopic = true;
        }

        return queryParams;
    };

    _fetchArticles = (initParams) => {
        let options = {};
        if (this.props.articleDisplayMode === 'summary') {
            options.summary = true;
        }
        if (this.props.articlesLoaderMode === 'all') {
            options.limit = 1000;
        }
        if (this.props.initProps?.articles) {
            options.localArticles = this.props.initProps.articles;
        }
        if (initParams?.page) {
            options.page = initParams.page;
        }

        let payload = {};
        if (this.props.currentUserId) {
            payload.isConnected = true;
            payload.isOwner = this.props.userSlug === this.props.routeParams.userSlug;
        }

        this._request = this.props.fetchArticles({
            userId: this.props.currentUserId,
            ...this._formatParams(),
        }, options, payload);

        if (this.props.routeParams.tagSlug) {
            this._request.fetch.then(() => this.props.setCurrentTags([this.props.routeParams.tagSlug, this.props.routeParams.childTagSlug]));
        }
    };

    _fetchNextArticles = (params = {}) => {
        if (this.props.articlePagination && this.props.articlePagination.currentPage <= this.props.articlePagination.totalPages) {
            const queryParams = parse(this.props.routeHash.replace(/^\?/, ''));
            const options = {
                page: (params.selected || this.props.articlePagination.currentPage) + 1
            };

            if (this.props.articleDisplayMode === 'summary') {
                options.summary = true;
            }

            let payload = {
                infinite: !params.selected
            };
            if (this.props.currentUserId) {
                payload.isConnected = true;
                payload.isOwner = this.props.userSlug === this.props.routeParams.userSlug;
            }

            this._request = this.props.fetchArticles({
                userId: this.props.currentUserId,
                ...this._formatParams(),
                ...queryParams
            }, options, payload);

            this._request.fetch.then(() => {
                if (params.selected && this._articles.current) {
                    window.scroll({
                        top: this._articles.current.getBoundingClientRect().top - headerMargin,
                        behavior: 'smooth'
                    });
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
        if (this.props.currentState === 'userEmpty') {
            return (
                <div>
                    <ArticleNoneDisplay userSlug={this.props.routeParams.userSlug}
                                        topicSlug={this.props.routeParams.topicSlug}
                                        tagSlug={this.props.routeParams.tagSlug}
                                        childTagSlug={this.props.routeParams.childTagSlug}
                                        isTopicPage={true}
                                        isSearchPage={false}/>

                    {
                        this.props.routeParams.tagSlug &&
                        <ArticleRecommendationDisplay userSlug={this.props.routeParams.userSlug}
                                                      topicSlug={this.props.routeParams.topicSlug}
                                                      tagSlug={this.props.routeParams.tagSlug}
                                                      childTagSlug={this.props.routeParams.childTagSlug}/>
                    }
                </div>
            );
        }

        if (this.props.currentState === 'empty') {
            return (
                <div className="center margin-top-45 margin-bottom-65">
                    <NotFound/>
                </div>
            );
        }

        const hasMoreArticles = this.props.articlePagination && this.props.articlePagination.currentPage < this.props.articlePagination.totalPages;

        const isStoryMode = this.props.articleCurrentMode === 'stories' && this.props.storyTopic;

        const isGridDisplay = this.props.articleDisplayMode === 'grid';
        const isInfiniteDisplay = this.props.articlesLoaderMode === 'infinite';

        const isLargeContainer = isGridDisplay || isStoryMode;
        const isFullContainer = isStoryMode || this.props.articleCurrentMode === 'inventories';

        let ArticleNodes;
        if (isStoryMode) {
            ArticleNodes = (
                <ArticleTimelineMode topicVisibility={this.props.currentTopic?.visibility}
                                     onEnter={this._handleArticleEnter}
                                     onExit={this._handleArticleExit}/>
            );
        } else if (isGridDisplay) {
            ArticleNodes = (
                <ArticleMasonryMode onEnter={this._handleArticleEnter}
                                    onExit={this._handleArticleExit}/>
            );
        } else {
            ArticleNodes = (
                <ArticleListMode parentTagSlug={this.props.routeParams.tagSlug}
                                 isMinimized={this.props.areArticlesMinimized}
                                 articleEditionId={this.props.articleEditionId}
                                 onEnter={this._handleArticleEnter}
                                 onExit={this._handleArticleExit}/>
            );
        }

        return (
            <div ref={this._articles}>
                {
                    (isStoryMode && this.props.storyTopic.slug === this.props.routeParams.topicSlug) &&
                    <SummaryStoriesTopic userSlug={this.props.routeParams.userSlug}
                                         topic={this.props.storyTopic}/>
                }

                <div className={classNames(this.props.classes.articleIndex, {
                    [this.props.classes.largeContainer]: isLargeContainer,
                    [this.props.classes.fullContainer]: isFullContainer
                })}>
                    {
                        this.props.currentState === 'fetching' &&
                        <div className={this.props.classes.articleIndex}>
                            <div className="center">
                                <Loader size="big"/>
                            </div>
                        </div>
                    }

                    {
                        (this.props.currentState === 'loaded' || this.props.currentState === 'userLoaded' || this.props.currentState === 'fetchingMore') &&
                        <Suspense fallback={<div/>}>
                            {
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
                            }
                        </Suspense>
                    }

                    {
                        this.props.articlesLoaderMode === 'paginate' &&
                        <Pagination totalPages={this.props.articlePagination?.totalPages}
                                    onPaginationClick={this._fetchNextArticles}/>
                    }
                </div>
            </div>
        );
    }
}
