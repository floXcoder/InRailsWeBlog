'use strict';

import '../../../stylesheets/pages/article/show.scss';

import {
    Link
} from 'react-router-dom';

import Sticky from 'react-sticky-el';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import {
    ArticleIndex,
    ArticleEdit
} from '../loaders/components';

import {
    userArticlePath,
    topicArticlesPath
} from '../../constants/routesHelper';

import {
    fetchArticle,
    fetchArticleRecommendations,
    changeArticleLanguage,
    markArticleOutdated,
    unmarkArticleOutdated,
    checkLinksArticle,
    deleteArticle,
    setCurrentTags,
    showUserSignup
} from '../../actions';

import {
    getCurrentUser,
    getIsCurrentTopicOwner,
    getArticleIsOwner
} from '../../selectors';

import {
    articleRecommendationPreloadTime,
    articleIndexPreloadTime,
    articleEditPreloadTime
} from '../modules/constants';

import {
    onPageReady,
    lazyImporter
} from '../loaders/lazyLoader';

import LoadOnScroll from '../loaders/loadOnScroll';

import withRouter from '../modules/router';

import highlight from '../modules/highlight';

import CommentCountIcon from '../comments/icons/count';

import NotFound from '../layouts/notFound';

import SummaryStoriesTopic from '../topics/stories/summary';

import ArticleAvatarIcon from './icons/avatar';
import ArticleLanguageIcon from './icons/language';
import ArticleEditIcon from './icons/edit';
import ArticleTags from './properties/tags';
import ArticleFloatingIcons from './properties/floatingIcons';
import ArticleActions from './properties/actions';
import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleInventoryDisplay from './display/items/inventory';
import ArticleMiniCardDisplay from './display/items/miniCard';
import ArticleSkeleton from '../loaders/skeletons/article';

const CommentBox = lazyImporter(() => import(/* webpackChunkName: "comment-box" */ '../comments/box'));


export default @withRouter({
    location: true,
    params: true,
    navigate: true
})
@connect((state, props) => ({
    currentUserSlug: state.userState.currentSlug,
    currentUser: getCurrentUser(state),
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
    deleteArticle,
    setCurrentTags,
    showUserSignup
})
@highlight(false)
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
        deleteArticle: PropTypes.func,
        setCurrentTags: PropTypes.func,
        showUserSignup: PropTypes.func,
        // from highlight
        onShow: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._request = null;

        this._recommendationTimeout = null;
        this._articleIndexTimeout = null;
        this._articleEditTimeout = null;
        this._articleLanguagesTimeout = null;
    }

    componentDidMount() {
        this._request = this.props.fetchArticle(this.props.routeParams.userSlug, this.props.routeParams.articleSlug, {
            localArticle: this.props.initProps?.article
        });

        this._highlightMatchedContent();

        this._recommendationTimeout = onPageReady(() => this._fetchRecommendations(), window.seoMode ? 50 : articleRecommendationPreloadTime);

        if (!window.seoMode) {
            this._articleIndexTimeout = onPageReady(() => ArticleIndex.preload(), articleIndexPreloadTime);
            if (this.props.currentUserSlug && this.props.currentUserSlug === this.props.routeParams.userSlug) {
                this._articleEditTimeout = onPageReady(() => ArticleEdit.preload(), articleEditPreloadTime);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.article) {
            this.props.setCurrentTags(this.props.article.tags.map((tag) => tag.slug));

            // Highlight code
            this.props.onShow(this.props.article.id, true);

            this._highlightMatchedContent();
        }

        if (!Object.equals(this.props.routeParams, prevProps.routeParams)) {
            this._request = this.props.fetchArticle(this.props.routeParams.userSlug, this.props.routeParams.articleSlug);
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

        if (this._request?.signal) {
            this._request.signal.abort();
        }
    }

    _fetchRecommendations = () => {
        if (!this.props.articleRecommendations && this.props.article && this.props.routeParams.userSlug !== this.props.currentUserSlug) {
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

                Notification.success(message[visitorLanguage], button[visitorLanguage], () => window.location.replace(userArticlePath(this.props.routeParams.userSlug, this.props.article.slugTranslations[visitorLanguage], visitorLanguage)));
            }
        }
    };

    _highlightMatchedContent = () => {
        if (this.props.article && this.props.routeLocation.state?.highlightContent && window.find) {
            window.find(this.props.routeLocation.state.highlightContent);
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

    _handleDeleteClick = (event) => {
        event.preventDefault();

        this.props.deleteArticle(this.props.article.id)
            .then(() => this.props.routeNavigate({
                pathname: topicArticlesPath(this.props.currentUser.slug, this.props.currentTopic.slug),
            }, {
                state: {reloadTags: true}
            }));
    };

    render() {
        if (!this.props.article && !this.props.isFetching) {
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
                    <article id={`article-${this.props.article.id}`}
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
                                    <Grid item={true}
                                          xs={12}>
                                        <h2 itemProp="description">
                                            {this.props.article.summary}
                                        </h2>
                                    </Grid>
                                }

                                <Typography className="article-show-title"
                                            variant="h1"
                                            itemProp="name headline">
                                    {title}
                                </Typography>

                                <Grid item={true}
                                      xs={12}>
                                    <Grid container={true}
                                          classes={{
                                              container: 'article-show-article-info'
                                          }}
                                          spacing={1}
                                          direction="row"
                                          justifyContent="space-between"
                                          alignItems="center">
                                        <Grid item={true}>
                                            <ArticleAvatarIcon user={this.props.article.user}
                                                               createdDate={this.props.article.date}
                                                               updatedDate={this.props.article.updatedDate}/>
                                        </Grid>

                                        <Grid className="hide-on-small"
                                              item={true}>
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
                                                        <Button
                                                            variant="outlined"
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
                                                    isOutdated={this.props.article.outdated}
                                                    hasLinks={hasLinks}
                                                    onOutdatedClick={this._handleOutdatedClick}
                                                    onCheckLinkClick={this._handleCheckLinkClick}
                                                    onDeleteClick={this._handleDeleteClick}/>
                                }
                            </div>
                        </div>
                    </article>
                }

                {
                    (!!this.props.article && !this.props.isFetching && this.props.routeParams.userSlug !== this.props.currentUserSlug) &&
                    <div className="article-show-recommendations-container">
                        <Divider/>

                        {
                            !!(isStoryMode && !this.props.isUserConnected) &&
                            <SummaryStoriesTopic userSlug={this.props.routeParams.userSlug}
                                                 topic={this.props.storyTopic}
                                                 hasLink={true}/>
                        }

                        {
                            !isStoryMode &&
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
                                        <Grid key={article.id}
                                              item={true}>
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
                                                                        hasTags={false}/>
                                            </div>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        }

                        {
                            !isStoryMode &&
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
