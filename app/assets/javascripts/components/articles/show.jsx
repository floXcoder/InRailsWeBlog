'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
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
import Card from '@material-ui/core/Card';

import {
    ArticleIndex,
    ArticleEdit
} from '../loaders/components';

import {
    fetchArticle,
    fetchArticleStories,
    markArticleOutdated,
    unmarkArticleOutdated,
    deleteArticle,
    setCurrentTags
} from '../../actions';

import {
    getArticleSiblingStories,
    getCurrentUser,
    getIsCurrentTopicOwner,
    getArticleIsOwner
} from '../../selectors';

import {
    articlePreloadIndex,
    articlePreloadEdit
} from '../modules/constants';

import highlight from '../modules/highlight';

import Loader from '../theme/loader';
import LazyLoader from '../theme/lazyLoader';

import CommentCountIcon from '../comments/icons/count';

import CommentBox from '../loaders/commentBox';

import HeadLayout from '../layouts/head';
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

import styles from '../../../jss/article/show';

export default @withRouter
@connect((state, props) => ({
    metaTags: state.articleState.metaTags,
    currentUser: getCurrentUser(state),
    currentTopic: state.topicState.currentTopic,
    isCurrentTopicOwner: getIsCurrentTopicOwner(state, props.routeParams),
    isFetching: state.articleState.isFetching,
    article: state.articleState.article,
    isOwner: getArticleIsOwner(state, state.articleState.article),
    isUserConnected: state.userState.isConnected,
    articleSiblingStories: getArticleSiblingStories(state)
}), {
    fetchArticle,
    fetchArticleStories,
    markArticleOutdated,
    unmarkArticleOutdated,
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
        // from router
        history: PropTypes.object,
        // from connect
        metaTags: PropTypes.object,
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        isCurrentTopicOwner: PropTypes.bool,
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        isOwner: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        articleSiblingStories: PropTypes.array,
        fetchArticle: PropTypes.func,
        fetchArticleStories: PropTypes.func,
        markArticleOutdated: PropTypes.func,
        unmarkArticleOutdated: PropTypes.func,
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
    }

    componentDidMount() {
        this._request = this.props.fetchArticle(this.props.routeParams.userSlug, this.props.routeParams.articleSlug);

        this._fetchStories();

        setTimeout(() => ArticleIndex.preload(), articlePreloadIndex);
        setTimeout(() => this.props.currentUser && ArticleEdit.preload(), articlePreloadEdit);
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

        this._fetchStories();
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    _fetchStories = () => {
        if (this.props.article && this.props.article.mode === 'story' && !this.props.articleSiblingStories) {
            this.props.fetchArticleStories(this.props.article.id);
        }
    };

    _handleOutdatedClick = (event) => {
        event.preventDefault();

        if (this.props.article.outdated) {
            this.props.unmarkArticleOutdated(this.props.article.id)
                .then((response) => response && response.errors && Notification.error(response.errors));
        } else {
            this.props.markArticleOutdated(this.props.article.id)
                .then((response) => response && response.errors && Notification.error(response.errors));
        }
    };

    _handleDeleteClick = (event) => {
        event.preventDefault();

        this.props.deleteArticle(this.props.article.id)
            .then(() => this.props.history.push({
                    pathname: `/users/${this.props.currentUser.slug}/topics/${this.props.currentTopic.slug}`,
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
            )
        }

        if ((this.props.isUserConnected && (!this.props.currentUser || !this.props.currentTopic)) || !this.props.article) {
            return (
                <div className={this.props.classes.root}>
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                </div>
            );
        }

        const isStories = this.props.article.mode === 'story';

        return (
            <div>
                <StickyContainer>
                    {
                        (this.props.routeState && this.props.routeState.position && this.props.isFetching) &&
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
                        isStories &&
                        <SummaryStoriesTopic userSlug={this.props.routeParams.userSlug}
                                             topic={this.props.article.topic}/>
                    }

                    {
                        !this.props.isFetching &&
                        <article className={this.props.classes.root}>
                            <HeadLayout metaTags={this.props.metaTags}/>

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
                                                                  color="action"
                                                                  history={this.props.history}
                                                                  isOwner={this.props.isOwner}
                                                                  userSlug={this.props.article.user.slug}
                                                                  articleId={this.props.article.id}
                                                                  articleSlug={this.props.article.slug}
                                                                  articleTitle={this.props.article.title}
                                                                  topicSlug={this.props.article.slug.split('@').last()}/>
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
                                            <h2 className="blog-article-summary">
                                                {this.props.article.summary}
                                            </h2>
                                        </Grid>
                                    }

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
                                                    this.props.isOwner &&
                                                    <div className={this.props.classes.editIcon}>
                                                        <ArticleEditIcon userSlug={this.props.article.user.slug}
                                                                         articleSlug={this.props.article.slug}
                                                                         size="large"
                                                                         color="action"/>
                                                    </div>
                                                }

                                                {
                                                    (this.props.article.allowComment && this.props.article.visibility !== 'only_me') &&

                                                    <CommentCountIcon className={this.props.classes.commentCount}
                                                                      commentLink={`#article-comments-${this.props.article.id}`}
                                                                      commentsCount={this.props.article.commentsCount}
                                                                      hasIcon={false}/>
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Typography className={this.props.classes.title}
                                            variant="h1">
                                    {this.props.article.title}
                                </Typography>

                                {
                                    this.props.article.mode === 'inventory'
                                        ?
                                        <ArticleInventoryDisplay inventories={this.props.article.inventories}/>
                                        :
                                        <div className={classNames('normalized-content')}
                                             dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                                }

                                {
                                    this.props.article.reference &&
                                    <div className="blog-article-info">
                                        <a href={this.props.article.reference}
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
                                                     tags={this.props.article.tags}
                                                     parentTagIds={this.props.article.parentTagIds}
                                                     childTagIds={this.props.article.childTagIds}/>
                                    }

                                    {
                                        this.props.isOwner &&
                                        <ArticleActions classes={this.props.classes}
                                                        size="default"
                                                        color="action"
                                                        userSlug={this.props.article.user.slug}
                                                        articleId={this.props.article.id}
                                                        articleSlug={this.props.article.slug}
                                                        articleTitle={this.props.article.title}
                                                        articleVisibility={this.props.article.visibility}
                                                        isOutdated={this.props.article.outdated}
                                                        onOutdatedClick={this._handleOutdatedClick}
                                                        onDeleteClick={this._handleDeleteClick}/>
                                    }
                                </div>
                            </div>
                        </article>
                    }
                </StickyContainer>

                {
                    !this.props.isFetching &&
                    <div className={this.props.classes.storiesContainer}>
                        {
                            this.props.articleSiblingStories &&
                            <Grid container={true}
                                  direction="row"
                                  justify="space-evenly"
                                  alignItems="flex-start">
                                {
                                    this.props.articleSiblingStories.map((article, i) => (
                                        <Grid key={article.id}
                                              item={true}>
                                            <h3 className={this.props.classes.storiesTitle}>
                                                {
                                                    i % 2 === 0
                                                        ?
                                                        I18n.t('js.article.show.stories.previous')
                                                        :
                                                        I18n.t('js.article.show.stories.next')
                                                }
                                            </h3>

                                            <Card className={this.props.classes.storiesArticle}>
                                                <ArticleMiniCardDisplay article={article}
                                                                        hasTags={false}/>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        }

                        {
                            (this.props.article.allowComment && this.props.article.visibility !== 'only_me') &&
                            <LazyLoader height={0}
                                        once={true}
                                        offset={50}>
                                <CommentBox id={`article-comments-${this.props.article.id}`}
                                            commentableType="articles"
                                            commentableId={this.props.article.id}
                                            ownerId={this.props.article.user.id}
                                            commentsCount={this.props.article.commentsCount}
                                            isUserOwner={this.props.isOwner}
                                            isPaginated={false}
                                            isRated={true}/>
                            </LazyLoader>
                        }
                    </div>
                }
            </div>
        );
    }
}
