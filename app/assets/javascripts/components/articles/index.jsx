import React, {
    Suspense
} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import classNames from 'classnames';

import {
    parse
} from 'qs';

import I18n from '@js/modules/translations';

import {
    ArticleShow,
    ArticleListMode,
    ArticleInfiniteMode,
    ArticleMasonryMode,
    ArticleTimelineMode
} from '@js/components/loaders/components';

import {
    fetchArticles
} from '@js/actions/articleActions';

import {
    setCurrentArticles,
    updateArticleOrderDisplay
} from '@js/actions/uiActions';

import {
    fetchTag,
    setCurrentTags
} from '@js/actions/tagActions';

import {
    fetchUser
} from '@js/actions/userActions';

import {
    fetchTopic,
} from '@js/actions/topicActions';

import {
    getArticlesCurrentMode,
    getArticlesCount
} from '@js/selectors/articleSelectors';

import {
    headerMargin,
    articleShowPreloadTime
} from '@js/components/modules/constants';

import {
    onPageReady
} from '@js/components/loaders/lazyLoader';

import RouteManager from '@js/modules/routeManager';
import withRouter from '@js/components/modules/router';

import Loader from '@js/components/theme/loader';
import Pagination from '@js/components/theme/pagination';

import NotFound from '@js/components/layouts/notFound';

import SummaryStoriesTopic from '@js/components/topics/stories/summary';

import ArticleRecommendationDisplay from '@js/components/articles/display/recommendation';
import ArticleNoneDisplay from '@js/components/articles/display/items/none';

import '@css/pages/article/index.scss';


class ArticleIndex extends React.Component {
    static propTypes = {
        initProps: PropTypes.object,
        // from router
        routeLocation: PropTypes.object,
        routeParams: PropTypes.object,
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
        metaTags: PropTypes.object,
        fetchArticles: PropTypes.func,
        updateArticleOrderDisplay: PropTypes.func,
        setCurrentArticles: PropTypes.func,
        fetchTag: PropTypes.func,
        fetchUser: PropTypes.func,
        fetchTopic: PropTypes.func,
        setCurrentTags: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._request = null;
        this._articleShowTimeout = null;

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
            this._articleShowTimeout = onPageReady(() => ArticleShow.preload(), articleShowPreloadTime);
        }
    }

    componentDidUpdate(prevProps) {
        // Manage articles order or sort display
        if (!Object.equals(this.props.routeParams, prevProps.routeParams) || this.props.routeLocation.search !== prevProps.routeLocation.search) {
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

        if (this._articleShowTimeout) {
            clearTimeout(this._articleShowTimeout);
        }
    }

    _formatParams = () => {
        const queryParams = {};

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

        if (this.props.routeParams['0'] && (RouteManager.isSharedTopic(this.props.routeParams['0']) || this.props.routeParams['0'] === 'shared-topics')) {
            queryParams.sharedTopic = true;
        }

        return queryParams;
    };

    _fetchArticles = (initParams) => {
        const options = {};
        const requestOptions = {};

        if (this.props.articleDisplayMode === 'summary') {
            options.summary = true;
        }
        if (this.props.articlesLoaderMode === 'all') {
            options.limit = 1000;
        }
        if (this.props.initProps?.articles) {
            requestOptions.localArticles = this.props.initProps.articles;
        }
        if (initParams?.page) {
            options.page = initParams.page;
        }

        const payload = {};
        if (this.props.currentUserId) {
            payload.isConnected = true;
            payload.isOwner = this.props.currentUserSlug === this.props.routeParams.userSlug;
        }

        this._request = this.props.fetchArticles({
            userId: this.props.currentUserId,
            ...this._formatParams(),
        }, options, payload, requestOptions);

        if (this.props.routeParams.topicSlug && this.props.routeParams.userSlug && !this.props.routeParams.tagSlug) {
            this._request.fetch.then(() => {
                this.props.fetchTopic(this.props.routeParams.userSlug, this.props.routeParams.topicSlug, {no_meta: true});
            });
        } else if (this.props.routeParams.tagSlug) {
            this._request.fetch.then(() => {
                this.props.fetchTag(this.props.routeParams.tagSlug, {no_meta: true});
            });
        } else if (this.props.routeParams.userSlug) {
            this._request.fetch.then(() => {
                this.props.fetchUser(this.props.routeParams.userSlug, {no_meta: true});
            });
        }

        if (this.props.routeParams.tagSlug) {
            this.props.setCurrentTags([this.props.routeParams.tagSlug, this.props.routeParams.childTagSlug]);
        }
    };

    _fetchNextArticles = (params = {}) => {
        if (this.props.articlePagination && this.props.articlePagination.currentPage <= this.props.articlePagination.totalPages) {
            const queryParams = parse(this.props.routeLocation.search.replace(/^\?/, ''));
            const options = {
                page: (params.selected ?? this.props.articlePagination.currentPage) + 1
            };

            if (this.props.articleDisplayMode === 'summary') {
                options.summary = true;
            }

            const payload = {
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

    _renderTitle = () => {
        if (this.props.currentState === 'fetching') {
            return null;
        }

        if (this.props.routeParams.tagSlug && this.props.tag) {
            return (
                <div className={classNames('article-index-title', {
                    'article-index-title-connected': this.props.isUserConnected
                })}>
                    <h1>
                        {I18n.t('js.article.index.tagged_title', {tag: this.props.tag.name})}
                    </h1>
                </div>
            );
        } else if (this.props.routeParams.topicSlug && this.props.topic) {
            return (
                <div className={classNames('article-index-title', {
                    'article-index-title-connected': this.props.isUserConnected
                })}>
                    <h1>
                        {I18n.t('js.article.index.topic_title', {topic: this.props.topic.name})}
                    </h1>
                </div>
            );
        } else if (this.props.routeParams.userSlug && this.props.user) {
            return (
                <div className={classNames('article-index-title', {
                    'article-index-title-connected': this.props.isUserConnected
                })}>
                    <h1>
                        {I18n.t('js.article.index.user_title', {user: this.props.user.pseudo})}
                    </h1>
                </div>
            );
        } else {
            return null;
        }
    };

    render() {
        if (this.props.initProps?.status === '404') {
            return (
                <div className="center margin-top-20">
                    <NotFound/>
                </div>
            );
        }

        if (this.props.currentState === 'userEmpty') {
            return (
                <div>
                    <ArticleNoneDisplay userSlug={this.props.routeParams.userSlug}
                                        topicSlug={this.props.routeParams.topicSlug}
                                        tagSlug={this.props.routeParams.tagSlug}
                                        childTagSlug={this.props.routeParams.childTagSlug}
                                        isConnected={this.props.isUserConnected}
                                        isTopicPage={true}
                                        isSearchPage={false}/>

                    {
                        !!this.props.routeParams.tagSlug &&
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
                    <ArticleNoneDisplay userSlug={this.props.routeParams.userSlug}
                                        topicSlug={this.props.routeParams.topicSlug}
                                        tagSlug={this.props.routeParams.tagSlug}
                                        childTagSlug={this.props.routeParams.childTagSlug}
                                        isConnected={this.props.isUserConnected}
                                        alternativeUrl={this.props.metaTags?.alternativeUrl}
                                        isTopicPage={false}
                                        isSearchPage={false}/>
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
                    !!(isStoryMode && !this.props.isUserConnected) &&
                    <SummaryStoriesTopic userSlug={this.props.routeParams.userSlug}
                                         topic={this.props.storyTopic}/>
                }

                <div className={classNames('article-index', {
                    'article-index-large-container': isLargeContainer,
                    'article-index-full-container': isFullContainer
                })}>
                    {
                        this.props.currentState === 'fetching' &&
                        <div className="article-index">
                            <div className="center">
                                <Loader size="big"/>
                            </div>
                        </div>
                    }

                    {
                        this.props.currentState !== 'fetching' &&
                        this._renderTitle()
                    }

                    {
                        (this.props.currentState === 'loaded' || this.props.currentState === 'userLoaded' || this.props.currentState === 'fetchingMore') &&
                        <Suspense fallback={<div/>}>
                            {
                                isInfiniteDisplay
                                    ?
                                    <ArticleInfiniteMode articlesCount={this.props.articlesCount}
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

export default connect((state) => ({
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
    metaTags: state.uiState.metaTags,
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
})(withRouter({
    location: true,
    params: true
})(ArticleIndex));