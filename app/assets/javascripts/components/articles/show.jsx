'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    Link,
    withRouter
} from 'react-router-dom';

import {
    StickyContainer,
    Sticky
} from 'react-sticky';

import {
    withStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

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
    fetchRecommendations,
    markArticleOutdated,
    unmarkArticleOutdated,
    checkLinksArticle,
    deleteArticle,
    setCurrentTags
} from '../../actions';

import {
    getCurrentUser,
    getIsCurrentTopicOwner,
    getArticleIsOwner
} from '../../selectors';

import {
    articleIndexPreloadTime,
    articleEditPreloadTime
} from '../modules/constants';

import CommentBox from '../loaders/commentBox';

import highlight from '../modules/highlight';

import LazyLoader from '../theme/lazyLoader';

import CommentCountIcon from '../comments/icons/count';

import NotFound from '../layouts/notFound';

import SummaryStoriesTopic from '../topics/stories/summary';

import ArticleAvatarIcon from './icons/avatar';
import ArticleEditIcon from './icons/edit';
import ArticleTags from './properties/tags';
import ArticleFloatingIcons from './properties/floatingIcons';
import ArticleActions from './properties/actions';
import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleInventoryDisplay from './display/items/inventory';
import ArticleMiniCardDisplay from './display/items/miniCard';
import ArticleSkeleton from '../loaders/skeletons/article';

import styles from '../../../jss/article/show';

export default @withRouter
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
    articleRecommendations: state.articleState.articleRecommendations
}), {
    fetchArticle,
    fetchRecommendations,
    markArticleOutdated,
    unmarkArticleOutdated,
    checkLinksArticle,
    deleteArticle,
    setCurrentTags
})
@hot
@highlight(false)
@withStyles(styles)
class ArticleShow extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        routeState: PropTypes.object,
        initProps: PropTypes.object,
        // from router
        history: PropTypes.object,
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
        articleRecommendations: PropTypes.array,
        fetchArticle: PropTypes.func,
        fetchRecommendations: PropTypes.func,
        markArticleOutdated: PropTypes.func,
        unmarkArticleOutdated: PropTypes.func,
        checkLinksArticle: PropTypes.func,
        deleteArticle: PropTypes.func,
        setCurrentTags: PropTypes.func,
        // from highlight
        onShow: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._request = null;

        this._articleLanguagesTimeout = null;
        this._recommendationTimeout = null;
    }

    componentDidMount() {
        this._request = this.props.fetchArticle(this.props.routeParams.userSlug, this.props.routeParams.articleSlug, {
            localArticle: this.props.initProps?.article
        })

        this._recommendationTimeout = setTimeout(() => this._fetchRecommendations(), window.seoMode ? 50 : 500);

        if(!window.seoMode) {
            setTimeout(() => ArticleIndex.preload(), articleIndexPreloadTime);
            if (this.props.currentUserSlug && this.props.currentUserSlug === this.props.routeParams.userSlug) {
                setTimeout(() => ArticleEdit.preload(), articleEditPreloadTime);
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.article) {
            this.props.setCurrentTags(this.props.article.tags.map((tag) => tag.slug));

            // Highlight code
            this.props.onShow(this.props.article.id, true);
        }

        if (!Object.equals(this.props.routeParams, prevProps.routeParams)) {
            this._request = this.props.fetchArticle(this.props.routeParams.userSlug, this.props.routeParams.articleSlug);
        }

        this._recommendationTimeout = setTimeout(() => this._fetchRecommendations(), window.seoMode ? 50 : 500);
        if(!window.seoMode) {
            this._articleLanguagesTimeout = setTimeout(() => this._checkArticleLanguages(), 300);
        }
    }

    componentWillUnmount() {
        if (this._recommendationTimeout) {
            clearTimeout(this._recommendationTimeout);
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
            this.props.fetchRecommendations(this.props.routeParams.userSlug, this.props.article.id);
        }
    };

    _checkArticleLanguages = () => {
        if (this.props.article) {
            const visitorLanguage = (navigator.language || navigator.userLanguage)?.split('-')?.first();

            if (visitorLanguage && visitorLanguage !== window.locale && this.props.article.slugTranslations && this.props.article.slugTranslations[visitorLanguage] && this.props.article.languages?.length > 1 && this.props.article.languages.includes(visitorLanguage)) {
                const message = {
                    fr: 'L\'article est disponible en français',
                    en: 'This article is available in english',
                    de: 'Der Artikel ist auf Deutsch verfügbar',
                    it: 'L\'articolo è disponibile in italiano',
                    es: 'El artículo está disponible en español'
                };
                const button = {
                    fr: 'Consulter',
                    en: 'See',
                    de: 'Siehe',
                    it: 'Vedi',
                    es: 'Ver'
                };

                Notification.success(message[visitorLanguage], button[visitorLanguage], () => window.location.replace(userArticlePath(this.props.routeParams.userSlug, this.props.article.slugTranslations[visitorLanguage], visitorLanguage)));
            }
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
            .then(() => this.props.history.push({
                    pathname: topicArticlesPath(this.props.currentUser.slug, this.props.currentTopic.slug),
                    state: {reloadTags: true}
                })
            );
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
                <div className={this.props.classes.root}>
                    <div className="center">
                        <ArticleSkeleton isConnected={this.props.isCurrentTopicOwner}/>
                    </div>
                </div>
            );
        }

        const currentTopicSlug = this.props.article.slug.split('@').last();

        const isStoryMode = this.props.article.mode === 'story' && !!this.props.storyTopic && this.props.storyTopic.slug === currentTopicSlug;

        const hasLinks = this.props.article.content?.includes('<a ');

        return (
            <div>
                <StickyContainer>
                    {
                        (this.props.routeState?.position && this.props.isFetching) &&
                        <div className="center margin-top-20">
                            <div>
                                <span className="transition"
                                      style={{
                                          top: this.props.routeState.position.y,
                                          left: this.props.routeState.position.x
                                      }}>
                                    {this.props.routeState.title}
                                </span>
                            </div>
                        </div>
                    }

                    {
                        (isStoryMode && !this.props.isUserConnected) &&
                        <SummaryStoriesTopic userSlug={this.props.routeParams.userSlug}
                                             topic={this.props.storyTopic}
                                             hasLink={true}/>
                    }

                    {
                        !this.props.isFetching &&
                        <article className={this.props.classes.root}
                                 itemProp="blogPost"
                                 itemScope={true}
                                 itemType="https://schema.org/BlogPosting">
                            {
                                this.props.isCurrentTopicOwner &&
                                <div className={this.props.classes.breadcrumb}>
                                    <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                                              topic={this.props.currentTopic}
                                                              tags={this.props.article.tags}/>
                                </div>
                            }

                            {
                                this.props.isUserConnected &&
                                <div className={this.props.classes.floatingButtons}>
                                    <Sticky topOffset={0}
                                            bottomOffset={-430}>
                                        {({style, isSticky}) => (
                                            <ArticleFloatingIcons style={style}
                                                                  className={this.props.classes.floatingIcons}
                                                                  isSticky={isSticky}
                                                                  display="item"
                                                                  size="default"
                                                                  color="primary"
                                                                  history={this.props.history}
                                                                  isOwner={this.props.isOwner}
                                                                  userSlug={this.props.article.user.slug}
                                                                  articleId={this.props.article.id}
                                                                  articleSlug={this.props.article.slug}
                                                                  articleTitle={this.props.article.title}
                                                                  topicSlug={currentTopicSlug}/>
                                        )}
                                    </Sticky>
                                </div>
                            }

                            <div className={classNames({
                                [this.props.classes.outdated]: this.props.article.outdated
                            })}>
                                <Grid container={true}>
                                    {
                                        this.props.article.summary &&
                                        <Grid item={true}
                                              xs={12}>
                                            <h2 itemProp="description">
                                                {this.props.article.summary}
                                            </h2>
                                        </Grid>
                                    }

                                    <Typography className={this.props.classes.title}
                                                variant="h1"
                                                itemProp="name headline">
                                        {this.props.article.title}
                                    </Typography>

                                    <Grid item={true}
                                          xs={12}>
                                        <Grid container={true}
                                              classes={{
                                                  container: this.props.classes.articleInfo
                                              }}
                                              spacing={1}
                                              direction="row"
                                              justify="space-between"
                                              alignItems="center">
                                            <Grid item={true}>
                                                <ArticleAvatarIcon classes={this.props.classes}
                                                                   user={this.props.article.user}
                                                                   articleDate={this.props.article.date}/>
                                            </Grid>

                                            <Grid className="hide-on-small"
                                                  item={true}>
                                                {
                                                    this.props.isOwner
                                                        ?
                                                        <div className={this.props.classes.editIcon}>
                                                            <ArticleEditIcon userSlug={this.props.article.user.slug}
                                                                             articleSlug={this.props.article.slug}
                                                                             size="default"
                                                                             color="primary"/>
                                                        </div>
                                                        :
                                                        <div className={this.props.classes.editIcon}>
                                                            <Button color="default"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    component={Link}
                                                                    to={topicArticlesPath(this.props.article.userSlug, this.props.article.topicSlug)}>
                                                                {this.props.article.topicName}
                                                            </Button>
                                                        </div>
                                                }

                                                {
                                                    (this.props.article.allowComment && this.props.article.visibility !== 'only_me' && this.props.article.commentsCount > 0) &&
                                                    <CommentCountIcon className={this.props.classes.commentCount}
                                                                      commentLink={`#article-comments-${this.props.article.id}`}
                                                                      commentsCount={this.props.article.commentsCount}
                                                                      hasIcon={false}/>
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <div className={this.props.classes.articleContent}
                                     itemProp="articleBody">
                                    {
                                        this.props.article.mode === 'inventory'
                                            ?
                                            <ArticleInventoryDisplay inventories={this.props.article.inventories}/>
                                            :
                                            <div className="normalized-content"
                                                 dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                                    }
                                </div>

                                {
                                    this.props.article.reference &&
                                    <div className={this.props.classes.reference}>
                                        <a href={this.props.article.reference}
                                           className={this.props.classes.referenceLink}
                                           rel="noopener noreferrer"
                                           target="_blank">
                                            {Utils.normalizeLink(this.props.article.reference)}
                                        </a>
                                    </div>
                                }

                                <div className={this.props.classes.actions}>
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
                                        this.props.isOwner &&
                                        <ArticleActions classes={this.props.classes}
                                                        size="default"
                                                        color="primary"
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
                </StickyContainer>

                {
                    (!!this.props.article && !this.props.isFetching && this.props.routeParams.userSlug !== this.props.currentUserSlug) &&
                    <div className={this.props.classes.recommendationsContainer}>
                        <Divider/>

                        {
                            !isStoryMode &&
                            <h3 className={this.props.classes.recommendationsTitle}>
                                {I18n.t('js.article.show.recommendations.title')}
                            </h3>
                        }

                        {
                            this.props.articleRecommendations?.length > 0 &&
                            <Grid container={true}
                                  direction="row"
                                  justify="space-evenly"
                                  alignItems="flex-start">
                                {
                                    this.props.articleRecommendations.map((article, i) => (
                                        <Grid key={article.id}
                                              item={true}>
                                            {
                                                isStoryMode &&
                                                <h3 className={this.props.classes.recommendationsTitle}>
                                                    {
                                                        i % 2 === 0
                                                            ?
                                                            I18n.t('js.article.show.recommendations.previous')
                                                            :
                                                            I18n.t('js.article.show.recommendations.next')
                                                    }
                                                </h3>
                                            }

                                            <div className={this.props.classes.recommendationsArticle}>
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
                            <div className={this.props.classes.recommendationsLink}>
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
                    (this.props.article.allowComment && this.props.article.visibility !== 'only_me') &&
                    <div id={`article-comments-${this.props.article.id}`}
                         className={this.props.classes.commentsContainer}>
                        <LazyLoader height={0}
                                    once={true}
                                    offset={50}>
                            <CommentBox commentableType="articles"
                                        commentableId={this.props.article.id}
                                        ownerId={this.props.article.user.id}
                                        commentsCount={this.props.article.commentsCount}
                                        isUserOwner={this.props.isOwner}
                                        isPaginated={false}
                                        isRated={true}/>
                        </LazyLoader>
                    </div>
                }
            </div>
        );
    }
}
