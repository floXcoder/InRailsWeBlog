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
    getArticlesCount,
    getStoryTopic
} from '../../selectors';

import {
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
    storyTopic: getStoryTopic(state),
    isFetching: state.articleState.isFetching,
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
        // from connect
        currentUserId: PropTypes.number,
        currentTopic: PropTypes.object,
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

        this._request = null;
        this._isFetchingNext = false;
        this._articles = React.createRef();
    }

    componentDidMount() {
        // Wait for topic is loaded before fetching article (avoid double fetching)
        if (this.props.currentUserId) {
            if (this.props.currentTopic) {
                this._fetchArticles();
            }
        } else {
            this._fetchArticles();
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

    _fetchArticles = () => {
        let options = {};
        if (this.props.articleDisplayMode === 'summary') {
            options.summary = true;
        }
        if (this.props.articlesLoaderMode === 'all') {
            options.limit = 1000;
        }

        this._request = this.props.fetchArticles({
            userId: this.props.currentUserId,
            ...this._formatParams(),
        }, options);

        this._request.fetch.then(() => this.props.routeParams.tagSlug && this.props.setCurrentTags([this.props.routeParams.tagSlug, this.props.routeParams.childTagSlug]));
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

            this._isFetchingNext = true;

            this._request = this.props.fetchArticles({
                userId: this.props.currentUserId,
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
            if (this.props.currentUserId && this.props.currentTopic) {
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
            } else if (!this.props.currentUserId) {
                return (
                    <div className="center margin-top-45 margin-bottom-65">
                        <NotFound/>
                    </div>
                );
            }
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
                    this.props.articleCurrentMode === 'stories' && this.props.storyTopic &&
                    <SummaryStoriesTopic userSlug={this.props.routeParams.userSlug}
                                         topic={this.props.storyTopic}/>
                }

                <div className={classNames(this.props.classes.articleIndex, {
                    [this.props.classes.largeContainer]: isLargeContainer,
                    [this.props.classes.fullContainer]: isFullContainer
                })}>
                    {
                        (this.props.isFetching || (this.props.currentUserId && !this.props.currentTopic)) &&
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
                        <Pagination totalPages={this.props.articlePagination?.totalPages}
                                    onPaginationClick={this._fetchNextArticles}/>
                    }
                </div>
            </div>
        );
    }
}
