import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import classNames from 'classnames';

import {
    Link
} from 'react-router';

import Sticky from 'react-sticky-el';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import Mousetrap from 'mousetrap'; // Keyboard inputs

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';
import Notification from '@js/modules/notification';

import {
    ArticleIndex,
    ArticleEdit
} from '@js/components/loaders/components';

import {
    userArticlePath,
    topicArticlesPath,
    editArticlePath
} from '@js/constants/routesHelper';

import {
    fetchArticle,
    fetchArticleRecommendations,
    changeArticleLanguage,
    markArticleOutdated,
    unmarkArticleOutdated,
    checkLinksArticle,
    archiveArticle,
    unarchiveArticle,
    deleteArticle,
    showArticleContent,
} from '@js/actions/articleActions';

import {
    setCurrentTags
} from '@js/actions/tagActions';

import {
    showUserSignup
} from '@js/actions/uiActions';

import {
    switchTopic,
} from '@js/actions/topicActions';

import {
    getArticleIsOwner
} from '@js/selectors/articleSelectors';

import {
    getIsCurrentTopicOwner,
} from '@js/selectors/topicSelectors';

import {
    articleRecommendationPreloadTime,
    articleIndexPreloadTime,
    articleEditPreloadTime
} from '@js/components/modules/constants';

import {
    onPageReady,
    lazyImporter
} from '@js/components/loaders/lazyLoader';

import LoadOnScroll from '@js/components/loaders/loadOnScroll';

import withRouter from '@js/components/modules/router';

import highlight from '@js/components/modules/highlight';

import CommentCountIcon from '@js/components/comments/icons/count';

import NotFound from '@js/components/layouts/notFound';

import SummaryStoriesTopic from '@js/components/topics/stories/summary';

import ArticleAvatarIcon from '@js/components/articles/icons/avatar';
import ArticleLanguageIcon from '@js/components/articles/icons/language';
import ArticleEditIcon from '@js/components/articles/icons/edit';
import ArticleTags from '@js/components/articles/properties/tags';
import ArticleFloatingIcons from '@js/components/articles/properties/floatingIcons';
import ArticleActions from '@js/components/articles/properties/actions';
import ArticleBreadcrumbDisplay from '@js/components/articles/display/breadcrumb';
import ArticleInventoryDisplay from '@js/components/articles/display/items/inventory';
import ArticleMiniCardDisplay from '@js/components/articles/display/items/miniCard';
import ArticleSkeleton from '@js/components/loaders/skeletons/article';

import '@css/pages/article/show.scss';

const CommentBox = lazyImporter(() => import(/* webpackChunkName: "comment-box" */ '@js/components/comments/box'));


class ArticleShow extends React.Component {
    static propTypes = {
        initProps: PropTypes.object,
        // from router
        routeLocation: PropTypes.object,
        routeParams: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        currentUserSlug: PropTypes.string,
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        isUserConnected: PropTypes.bool,
        isCurrentTopicOwner: PropTypes.bool,
        isFetching: PropTypes.bool,
        storyTopic: PropTypes.object,
        article: PropTypes.object,
        isOwner: PropTypes.bool,
        articleCurrentLanguage: PropTypes.string,
        articleRecommendations: PropTypes.array,
        fetchArticle: PropTypes.func,
        fetchArticleRecommendations: PropTypes.func,
        changeArticleLanguage: PropTypes.func,
        markArticleOutdated: PropTypes.func,
        unmarkArticleOutdated: PropTypes.func,
        checkLinksArticle: PropTypes.func,
        archiveArticle: PropTypes.func,
        unarchiveArticle: PropTypes.func,
        deleteArticle: PropTypes.func,
        setCurrentTags: PropTypes.func,
        showUserSignup: PropTypes.func,
        switchTopic: PropTypes.func,
        showArticleContent: PropTypes.func,
        // from highlight
        onShow: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._articleRef = React.createRef();

        this._isInitialRequest = false;
        this._isDeleteRequest = false;
        this._request = null;

        this._isSearchHighlighted = false;

        this._recommendationTimeout = null;
        this._articleIndexTimeout = null;
        this._articleEditTimeout = null;
        this._articleLanguagesTimeout = null;
        this._mutationScrollTimeout = null;
    }

    componentDidMount() {
        this._isInitialRequest = true;

        this._request = this.props.fetchArticle(this.props.routeParams.userSlug, this.props.routeParams.articleSlug, {}, {
            localArticle: this.props.initProps?.article
        });

        this._highlightSearchedContent();

        this._buildContentTable();

        this._recommendationTimeout = onPageReady(() => this._fetchRecommendations(), window.seoMode ? 50 : articleRecommendationPreloadTime);

        if (!window.seoMode) {
            this._articleIndexTimeout = onPageReady(() => ArticleIndex.preload(), articleIndexPreloadTime);
            if (this.props.currentUserSlug && this.props.currentUserSlug === this.props.routeParams.userSlug) {
                this._articleEditTimeout = onPageReady(() => ArticleEdit.preload(), articleEditPreloadTime);
            }
        }

        if (this.props.routeLocation.state?.position) {
            this._mutationScrollTimeout = onPageReady(() => {
                window.scrollTo(this.props.routeLocation.state.position.left || 0, (this.props.routeLocation.state.position.top || 0) + 100);
            }, 350);
        }

        this._setHotkeys();
    }

    componentDidUpdate(prevProps) {
        this._isInitialRequest = false;
        this._isDeleteRequest = false;

        if (this.props.article) {
            this.props.setCurrentTags(this.props.article.tags.map((tag) => tag.slug));

            // Highlight code and force when article is updated
            this.props.onShow(this.props.article.id, true);

            this._highlightSearchedContent();

            this._buildContentTable();
        }

        if (this.props.article && !this.props.isFetching && (!Object.equals(this.props.routeParams, prevProps.routeParams) || this.props.article.slug !== this.props.routeParams.articleSlug)) {
            this._request = this.props.fetchArticle(this.props.routeParams.userSlug, this.props.routeParams.articleSlug);

            if (this.props.isUserConnected) {
                this._request.fetch.then(() => {
                    if (this.props.currentTopic.slug !== this.props.article.topicSlug) {
                        this.props.switchTopic(this.props.article.userSlug, this.props.article.topicSlug, {no_meta: true});
                    }
                });
            }
        }

        if (!window.seoMode) {
            this._articleLanguagesTimeout = onPageReady(() => this._checkArticleLanguages());
        }
    }

    componentWillUnmount() {
        if (this._recommendationTimeout) {
            clearTimeout(this._recommendationTimeout);
        }
        if (this._articleIndexTimeout) {
            clearTimeout(this._articleIndexTimeout);
        }
        if (this._articleEditTimeout) {
            clearTimeout(this._articleEditTimeout);
        }
        if (this._articleLanguagesTimeout) {
            clearTimeout(this._articleLanguagesTimeout);
        }
        if (this._mutationScrollTimeout) {
            clearTimeout(this._mutationScrollTimeout);
        }

        if (this._request?.signal) {
            this._request.signal.abort();
        }
    }

    _setHotkeys = () => {
        Mousetrap.bind('ctrl+e', (event) => {
            event.preventDefault();

            this.props.routeNavigate(editArticlePath(this.props.currentUserSlug, this.props.article.slug));
        }, 'keyup');
    };

    _fetchRecommendations = () => {
        if (!this.props.articleRecommendations && this.props.article /* && this.props.routeParams.userSlug !== this.props.currentUserSlug */) {
            this.props.fetchArticleRecommendations(this.props.routeParams.userSlug, this.props.article.id);
        }
    };

    _checkArticleLanguages = () => {
        if (this.props.article && !this.props.isOwner && !window.seoMode) {
            const visitorLanguage = (navigator.language || navigator.userLanguage)?.split('-')
                ?.first();

            if (visitorLanguage && visitorLanguage !== window.locale && this.props.article.slugTranslations && this.props.article.slugTranslations[visitorLanguage] && this.props.article.languages?.length > 1 && this.props.article.languages.includes(visitorLanguage)) {
                const message = {
                    fr: 'L\'article est disponible en français',
                    en: 'This article is available in english',
                    // de: 'Der Artikel ist auf Deutsch verfügbar',
                    // it: 'L\'articolo è disponibile in italiano',
                    // es: 'El artículo está disponible en español'
                };
                const button = {
                    fr: 'Consulter',
                    en: 'See',
                    // de: 'Siehe',
                    // it: 'Vedi',
                    // es: 'Ver'
                };

                Notification.success(message[visitorLanguage], 6000, button[visitorLanguage], () => window.location.replace(userArticlePath(this.props.routeParams.userSlug, this.props.article.slugTranslations[visitorLanguage], visitorLanguage)));
            }
        }
    };

    _highlightSearchedContent = () => {
        if (this._isSearchHighlighted) {
            return;
        }

        if (this.props.article && this.props.routeLocation.state?.highlightContent && window.find) {
            this._isSearchHighlighted = true;

            window.find(this.props.routeLocation.state.highlightContent);
        }
    };

    _buildContentTable = () => {
        if (this._articleRef && this._articleRef.current) {
            const articleContent = [];

            const headerElements = this._articleRef.current.querySelectorAll('h2, h3, h4, h5');
            for (const header in headerElements) {
                if (headerElements[header] instanceof Element) {
                    const headerContent = headerElements[header].textContent.trim();
                    const normalizedTitles = Utils.normalizeString(headerContent);
                    const titleLevel = headerElements[header].nodeName;
                    if (titleLevel === 'H5') {
                        continue;
                    }

                    let headerId = headerElements[header].id;
                    if (!headerId) {
                        headerId = normalizedTitles;
                        headerElements[header].id = headerId;
                    }
                    articleContent.push({
                        level: headerElements[header].nodeName,
                        id: headerId,
                        content: headerContent
                    });
                }
            }

            this.props.showArticleContent(articleContent.length ? articleContent : undefined);
        } else {
            this.props.showArticleContent(undefined);
        }
    };

    _handleOutdatedClick = (event) => {
        event.preventDefault();

        if (this.props.article.outdated) {
            this.props.unmarkArticleOutdated(this.props.article.id)
                .then((response) => response?.errors && Notification.error(response.errors));
        } else {
            this.props.markArticleOutdated(this.props.article.id)
                .then((response) => response?.errors && Notification.error(response.errors));
        }
    };

    _handleCheckLinkClick = (event) => {
        event.preventDefault();

        Notification.warn(I18n.t('js.article.common.dead_links.checking'));

        this.props.checkLinksArticle(this.props.article.id)
            .then(() => Notification.success(I18n.t('js.article.common.dead_links.done')));
    };

    _handleArchiveClick = (event) => {
        event.preventDefault();

        if (this.props.article.archived) {
            this.props.unarchiveArticle(this.props.article.id)
                .then((response) => response?.errors && Notification.error(response.errors));
        } else {
            this.props.archiveArticle(this.props.article.id)
                .then((response) => response?.errors && Notification.error(response.errors));
        }
    };

    _handleDeleteClick = (event) => {
        event.preventDefault();

        this._isDeleteRequest = true;

        this.props.deleteArticle(this.props.article.id)
            .then(() => this.props.routeNavigate({
                pathname: topicArticlesPath(this.props.currentUser.slug, this.props.currentTopic.slug),
            }, {
                state: {reloadTags: true}
            }));
    };

    render() {
        if (!this.props.article && !this.props.isFetching && !this._isInitialRequest && !this._isDeleteRequest) {
            return (
                <div className="center margin-top-20">
                    <NotFound/>
                </div>
            );
        }

        if ((this.props.isUserConnected && (!this.props.currentUser || !this.props.currentTopic)) || !this.props.article || this.props.isFetching) {
            return (
                <div className="article-show-root">
                    <div className="center">
                        <ArticleSkeleton isConnected={this.props.isCurrentTopicOwner}/>
                    </div>
                </div>
            );
        }

        const currentTopicSlug = this.props.article.slug.split('@')
            .last();

        const isStoryMode = this.props.article.mode === 'story' && !!this.props.storyTopic && this.props.storyTopic.slug === currentTopicSlug;

        const isPrivateInPublicTopic = this.props.currentTopic && this.props.article && this.props.currentTopic.id === this.props.article.topicId && this.props.currentTopic.visibility === 'everyone' && this.props.article.visibility !== 'everyone';

        const hasLinks = this.props.article.content?.includes('<a ');

        let title = this.props.article.title;
        if (this.props.isOwner && this.props.article.languages?.length > 1 && this.props.articleCurrentLanguage && this.props.article.titleTranslations) {
            title = this.props.article.titleTranslations[this.props.articleCurrentLanguage] || title;
        }

        let content = this.props.article.content;
        if (this.props.isOwner && this.props.article.languages?.length > 1 && this.props.articleCurrentLanguage && this.props.article.contentTranslations) {
            content = this.props.article.contentTranslations[this.props.articleCurrentLanguage] || content;
        }

        return (
            <div className="block">
                {
                    !!(this.props.routeLocation.state?.position && this.props.isFetching) &&
                    <div className="center margin-top-20">
                        <div>
                            <span className="transition"
                                  style={{
                                      top: this.props.routeLocation.state.position.y,
                                      left: this.props.routeLocation.state.position.x
                                  }}>
                                {this.props.routeLocation.search.title}
                            </span>
                        </div>
                    </div>
                }

                {
                    !this.props.isFetching &&
                    <article ref={this._articleRef}
                             id={`article-${this.props.article.id}`}
                             className="article-show-root scroll-area"
                             itemProp="blogPost"
                             itemScope={true}
                             itemType="https://schema.org/BlogPosting">
                        {
                            !!this.props.isCurrentTopicOwner &&
                            <div className="article-show-breadcrumb">
                                <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                                          topic={this.props.currentTopic}
                                                          tags={this.props.article.tags}/>
                            </div>
                        }

                        {
                            !!this.props.isUserConnected &&
                            <div className="article-show-floating-buttons">
                                <Sticky boundaryElement={`#article-${this.props.article.id}`}
                                        topOffset={20}
                                        bottomOffset={400}>
                                    <div className="article-show-floating-buttons">
                                        <ArticleFloatingIcons className="article-show-floating-icons"
                                                              display="item"
                                                              size="medium"
                                                              color="action"
                                                              routeNavigate={this.props.routeNavigate}
                                                              isOwner={this.props.isOwner}
                                                              userSlug={this.props.article.user.slug}
                                                              articleId={this.props.article.id}
                                                              articleSlug={this.props.article.slug}
                                                              articleTitle={this.props.article.title}
                                                              topicSlug={currentTopicSlug}/>
                                    </div>
                                </Sticky>
                            </div>
                        }

                        <div className={classNames({
                            'article-show-outdated': this.props.article.outdated
                        })}>
                            <Grid container={true}>
                                {
                                    !!this.props.article.summary &&
                                    <Grid size={{xs: 12}}>
                                        <h2 itemProp="description">
                                            {this.props.article.summary}
                                        </h2>
                                    </Grid>
                                }

                                <Typography
                                    className={classNames('article-show-title', {'article-show-title-archived': this.props.article.archived})}
                                    variant="h1"
                                    itemProp="name headline">
                                    {title}
                                </Typography>

                                {
                                    !!this.props.article.archived &&
                                    <div className="article-show-subtitle-archived">
                                        {I18n.t('js.article.common.archived')}
                                    </div>
                                }

                                <Grid size={{xs: 12}}>
                                    <Grid container={true}
                                          classes={{
                                              container: 'article-show-article-info'
                                          }}
                                          spacing={1}
                                          direction="row"
                                          justifyContent="space-between"
                                          alignItems="center">
                                        <Grid>
                                            <ArticleAvatarIcon user={this.props.article.user}
                                                               createdDate={this.props.article.date}
                                                               updatedDate={this.props.article.updatedDate}/>
                                        </Grid>

                                        <Grid className="hide-on-small">
                                            {
                                                this.props.isOwner
                                                    ?
                                                    <>
                                                        {
                                                            this.props.article.languages?.length > 1 &&
                                                            <div className="article-show-edit-icon">
                                                                <ArticleLanguageIcon
                                                                    currentLocale={this.props.articleCurrentLanguage || window.locale}
                                                                    languages={this.props.article.languages}
                                                                    onLanguageChange={this.props.changeArticleLanguage}
                                                                    size="medium"
                                                                    color="secondary"/>

                                                            </div>
                                                        }

                                                        <div className={classNames('article-show-edit-icon', {
                                                            'article-show-edit-icon-private': isPrivateInPublicTopic
                                                        })}>
                                                            <ArticleEditIcon userSlug={this.props.article.user.slug}
                                                                             articleSlug={this.props.article.slug}
                                                                             isIconButton={true}
                                                                             size="medium"
                                                                             color="secondary"/>
                                                        </div>
                                                    </>
                                                    :
                                                    <div className="article-show-edit-icon">
                                                        <Button variant="outlined"
                                                                size="small"
                                                                component={Link}
                                                                to={topicArticlesPath(this.props.article.userSlug, this.props.article.topicSlug)}>
                                                            {this.props.article.topicName}
                                                        </Button>
                                                    </div>
                                            }

                                            {
                                                !!(this.props.article.allowComment && this.props.article.visibility !== 'only_me' && this.props.article.commentsCount > 0) &&
                                                <CommentCountIcon className="article-show-comment-count"
                                                                  commentLink={`#article-comments-${this.props.article.id}`}
                                                                  commentsCount={this.props.article.commentsCount}
                                                                  hasIcon={false}/>
                                            }

                                            {
                                                !!isPrivateInPublicTopic &&
                                                <div className="article-show-private-message">
                                                    {I18n.t('js.article.common.private_in_public')}
                                                </div>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <div className="article-show-article-content"
                                 itemProp="articleBody">
                                {
                                    this.props.article.mode === 'inventory'
                                        ?
                                        <ArticleInventoryDisplay inventories={this.props.article.inventories}/>
                                        :
                                        <div className="normalized-content"
                                             dangerouslySetInnerHTML={{__html: content}}/>
                                }
                            </div>

                            {
                                !!this.props.article.reference &&
                                <div className="article-show-reference">
                                    <a href={this.props.article.reference}
                                       className="article-show-reference-link"
                                       rel="noopener noreferrer"
                                       target="_blank">
                                        {Utils.normalizeLink(this.props.article.reference)}
                                    </a>
                                </div>
                            }

                            <div className="article-show-actions">
                                {
                                    this.props.article.tags.length > 0 &&
                                    <ArticleTags articleId={this.props.article.id}
                                                 isOwner={this.props.currentUser?.id === this.props.article.userId}
                                                 currentUserSlug={this.props.currentUserSlug}
                                                 currentUserTopicSlug={this.props.currentTopic?.slug}
                                                 tags={this.props.article.tags}
                                                 parentTagIds={this.props.article.parentTagIds}
                                                 childTagIds={this.props.article.childTagIds}/>
                                }

                                {
                                    !!this.props.isOwner &&
                                    <ArticleActions size="medium"
                                                    color="secondary"
                                                    userSlug={this.props.article.user.slug}
                                                    articleId={this.props.article.id}
                                                    articleSlug={this.props.article.slug}
                                                    articleTitle={this.props.article.title}
                                                    articleVisibility={this.props.article.visibility}
                                                    isArchived={this.props.article.archived}
                                                    isOutdated={this.props.article.outdated}
                                                    hasLinks={hasLinks}
                                                    onOutdatedClick={this._handleOutdatedClick}
                                                    onCheckLinkClick={this._handleCheckLinkClick}
                                                    onArchiveClick={this._handleArchiveClick}
                                                    onDeleteClick={this._handleDeleteClick}/>
                                }
                            </div>
                        </div>
                    </article>
                }

                {
                    (!!this.props.article && !this.props.isFetching /* && this.props.routeParams.userSlug !== this.props.currentUserSlug*/) &&
                    <div className="article-show-recommendations-container">
                        <Divider/>

                        {
                            !!(this.props.routeParams.userSlug !== this.props.currentUserSlug && isStoryMode && !this.props.isUserConnected) &&
                            <SummaryStoriesTopic userSlug={this.props.routeParams.userSlug}
                                                 topic={this.props.storyTopic}
                                                 hasLink={true}/>
                        }

                        {
                            (this.props.routeParams.userSlug !== this.props.currentUserSlug && !isStoryMode) &&
                            <h3 className="article-show-recommendations-title">
                                {I18n.t('js.article.show.recommendations.title')}
                            </h3>
                        }

                        {
                            this.props.articleRecommendations?.length > 0 &&
                            <Grid container={true}
                                  direction="row"
                                  justifyContent="space-evenly"
                                  alignItems="flex-start">
                                {
                                    this.props.articleRecommendations.map((article, i) => (
                                        <Grid key={article.id}>
                                            {
                                                !!isStoryMode &&
                                                <h3 className="article-show-recommendations-title">
                                                    {
                                                        i % 2 === 0
                                                            ?
                                                            I18n.t('js.article.show.recommendations.previous')
                                                            :
                                                            I18n.t('js.article.show.recommendations.next')
                                                    }
                                                </h3>
                                            }

                                            <div className="article-show-recommendations-article">
                                                <ArticleMiniCardDisplay article={article}
                                                                        isPaper={true}
                                                                        isHighlighted={false}
                                                                        isFaded={true}
                                                                        hasTags={false}/>
                                            </div>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        }

                        {
                            (this.props.routeParams.userSlug !== this.props.currentUserSlug && !isStoryMode) &&
                            <div className="article-show-recommendations-link">
                                <Button color="primary"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={topicArticlesPath(this.props.article.userSlug, this.props.article.topicSlug)}>
                                    {I18n.t('js.article.show.recommendations.link')}
                                </Button>
                            </div>
                        }
                    </div>
                }

                {
                    !!(this.props.article.allowComment && this.props.article.visibility !== 'only_me') &&
                    <div id={`article-comments-${this.props.article.id}`}
                         className="article-show-comments-container">
                        <LoadOnScroll dynamicImport={true}
                                      offset={100}>
                            <CommentBox commentableType="articles"
                                        commentableId={this.props.article.id}
                                        ownerId={this.props.article.user.id}
                                        commentsCount={this.props.article.commentsCount}
                                        isUserOwner={this.props.isOwner}
                                        isPaginated={false}
                                        isRated={false}
                                        showSignup={this.props.showUserSignup}/>
                        </LoadOnScroll>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter({
    location: true,
    params: true,
    navigate: true
})(highlight()(connect((state, props) => ({
    currentUserSlug: state.userState.currentSlug,
    currentUser: state.userState.user,
    currentTopic: state.topicState.currentTopic,
    isUserConnected: state.userState.isConnected,
    isCurrentTopicOwner: getIsCurrentTopicOwner(state, props.routeParams),
    isFetching: state.articleState.isFetching,
    storyTopic: state.topicState.storyTopic,
    article: state.articleState.article,
    isOwner: getArticleIsOwner(state, state.articleState.article),
    articleCurrentLanguage: state.articleState.articleCurrentLanguage,
    articleRecommendations: state.articleState.articleRecommendations
}), {
    fetchArticle,
    fetchArticleRecommendations,
    changeArticleLanguage,
    markArticleOutdated,
    unmarkArticleOutdated,
    checkLinksArticle,
    archiveArticle,
    unarchiveArticle,
    deleteArticle,
    setCurrentTags,
    showUserSignup,
    switchTopic,
    showArticleContent
})(ArticleShow)));
