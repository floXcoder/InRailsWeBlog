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
    fetchTag,
    fetchUser,
    fetchTopic,
    setCurrentTags
} from '../../actions';

import {
    getArticlesCurrentMode,
    getArticlesCount
} from '../../selectors';

import {
    headerMargin,
    articleShowPreloadTime
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
    currentUserSlug: state.userState.currentSlug,
    currentTopic: state.topicState.currentTopic,
    isUserConnected: state.userState.isConnected,
    storyTopic: state.topicState.storyTopic,
    currentState: state.articleState.currentState.value,
    articlesCount: getArticlesCount(state),
    articlePagination: state.articleState.pagination,
    articleCurrentMode: getArticlesCurrentMode(state),
    articlesLoaderMode: state.uiState.articlesLoaderMode,
    articleDisplayMode: state.uiState.articleDisplayMode,
    areArticlesMinimized: state.uiState.areArticlesMinimized,
    articleEditionId: state.articleState.articleEditionId,
    tag: state.tagState.tag,
    user: state.userState.user,
    topic: state.topicState.topic,
}), {
    fetchArticles,
    updateArticleOrderDisplay,
    setCurrentArticles,
    fetchTag,
    fetchUser,
    fetchTopic,
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
        currentUserSlug: PropTypes.string,
        isUserConnected: PropTypes.bool,
        storyTopic: PropTypes.object,
        currentState: PropTypes.string,
        articlesCount: PropTypes.number,
        articleCurrentMode: PropTypes.string,
        articlePagination: PropTypes.object,
        articleEditionId: PropTypes.number,
        articlesLoaderMode: PropTypes.string,
        articleDisplayMode: PropTypes.string,
        areArticlesMinimized: PropTypes.bool,
        tag: PropTypes.object,
        user: PropTypes.object,
        topic: PropTypes.object,
        fetchArticles: PropTypes.func,
        updateArticleOrderDisplay: PropTypes.func,
        setCurrentArticles: PropTypes.func,
        fetchTag: PropTypes.func,
        fetchUser: PropTypes.func,
        fetchTopic: PropTypes.func,
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

        if (!window.seoMode) {
            setTimeout(() => ArticleShow.preload(), articleShowPreloadTime);
        }
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

        if (this.props.routeParams['0'] && this.props.routeParams['0'] === window.localizedRoutes[window.locale]['shared-topics'] || this.props.routeParams['0'] === 'shared-topics') {
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
            payload.isOwner = this.props.currentUserSlug === this.props.routeParams.userSlug;
        }

        this._request = this.props.fetchArticles({
            userId: this.props.currentUserId,
            ...this._formatParams(),
        }, options, payload);

        if (this.props.routeParams.topicSlug && this.props.routeParams.userSlug) {
            this._request.fetch.then(() => {
                this.props.fetchTopic(this.props.routeParams.userSlug, this.props.routeParams.topicSlug, {no_meta: true});
            });
        } else if (this.props.routeParams.tagSlug) {
            this._request.fetch.then(() => {
                this.props.setCurrentTags([this.props.routeParams.tagSlug, this.props.routeParams.childTagSlug]);

                this.props.fetchTag(this.props.routeParams.tagSlug, {no_meta: true});
            });
        } else if (this.props.routeParams.userSlug) {
            this._request.fetch.then(() => {
                this.props.fetchUser(this.props.routeParams.userSlug, {no_meta: true});
            });
        }
    };

    _fetchNextArticles = (params = {}) => {
        if (this.props.articlePagination && this.props.articlePagination.currentPage <= this.props.articlePagination.totalPages) {
            const queryParams = parse(this.props.routeHash.replace(/^\?/, ''));
            const options = {
                page: (params.selected ?? this.props.articlePagination.currentPage) + 1
            };

            if (this.props.articleDisplayMode === 'summary') {
                options.summary = true;
            }

            let payload = {
                infinite: !params.pagination
            };
            if (this.props.currentUserId) {
                payload.isConnected = true;
                payload.isOwner = this.props.currentUserSlug === this.props.routeParams.userSlug;
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

        const isUserArticlesList = this.props.currentUserId && this.props.routeParams.userSlug && Object.keys(this.props.routeParams).length === 1;

        const hasMoreArticles = this.props.articlePagination && this.props.articlePagination.currentPage < this.props.articlePagination.totalPages;

        const isStoryMode = this.props.articleCurrentMode === 'stories' && !!this.props.storyTopic && this.props.storyTopic.slug === this.props.routeParams.topicSlug && (this.props.isUserConnected ? this.props.articleDisplayMode === 'summary' : true);

        const isGridDisplay = this.props.articleDisplayMode === 'grid';
        const isInfiniteDisplay = this.props.articlesLoaderMode === 'infinite';

        const isLargeContainer = isGridDisplay || isStoryMode;
        const isFullContainer = isStoryMode || this.props.articleCurrentMode === 'inventories';

        let ArticleNodes;
        if (isStoryMode) {
            ArticleNodes = (
                <ArticleTimelineMode topicVisibility={this.props.currentTopic?.visibility}
                                     isUserArticlesList={isUserArticlesList}
                                     onEnter={this._handleArticleEnter}
                                     onExit={this._handleArticleExit}/>
            );
        } else if (isGridDisplay) {
            ArticleNodes = (
                <ArticleMasonryMode isUserArticlesList={isUserArticlesList}
                                    onEnter={this._handleArticleEnter}
                                    onExit={this._handleArticleExit}/>
            );
        } else {
            ArticleNodes = (
                <ArticleListMode parentTagSlug={this.props.routeParams.tagSlug}
                                 isMinimized={this.props.areArticlesMinimized}
                                 articleEditionId={this.props.articleEditionId}
                                 isUserArticlesList={isUserArticlesList}
                                 onEnter={this._handleArticleEnter}
                                 onExit={this._handleArticleExit}/>
            );
        }

        return (
            <div ref={this._articles}>
                {
                    (isStoryMode && !this.props.isUserConnected) &&
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
                        (this.props.currentState !== 'fetching' && this.props.tag?.name) &&
                        <div className="margin-bottom-40">
                            <h1>
                                {I18n.t('js.article.index.tagged_title', {tag: this.props.tag.name})}
                            </h1>
                        </div>
                    }

                    {
                        (this.props.currentState !== 'fetching' && !this.props.isUserConnected && this.props.user?.pseudo) &&
                        <div className="margin-bottom-40">
                            <h1>
                                {I18n.t('js.article.index.user_title', {user: this.props.user.pseudo})}
                            </h1>
                        </div>
                    }

                    {
                        (this.props.currentState !== 'fetching' && this.props.topic?.name) &&
                        <div className="margin-bottom-40">
                            <h1>
                                {I18n.t('js.article.index.topic_title', {topic: this.props.topic.name})}
                            </h1>
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
