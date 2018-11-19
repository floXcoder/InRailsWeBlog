'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    StickyContainer,
    Sticky
} from 'react-sticky';

import {
    withStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import {
    fetchArticle,
    updateArticle,
    markArticleOutdated,
    unmarkArticleOutdated,
    deleteArticle,
    setCurrentTags
} from '../../actions';

import {
    getCurrentUser,
    getCurrentUserTopic,
    getIsCurrentTopicOwner,
    getArticleIsOwner
} from '../../selectors';

import highlight from '../modules/highlight';

import LazyLoader from '../theme/lazyLoader';

import CommentCountIcon from '../comments/icons/count';

import CommentBox from '../loaders/commentBox';

import NotFound from '../layouts/notFound';

import ArticleBreadcrumbDisplay from './display/breadcrumb';
import ArticleAvatarIcon from './icons/avatar';
import ArticleTags from './properties/tags';
import ArticleFloatingIcons from './properties/floatingIcons';
import ArticleActions from './properties/actions';

import styles from '../../../jss/article/show';

export default @hot(module)

@connect((state, props) => ({
    currentUser: getCurrentUser(state),
    currentTopic: getCurrentUserTopic(state),
    isCurrentTopicOwner: getIsCurrentTopicOwner(state, props.params),
    isFetching: state.articleState.isFetching,
    article: state.articleState.article,
    isOwner: getArticleIsOwner(state, state.articleState.article),
    isUserConnected: state.userState.isConnected
}), {
    fetchArticle,
    updateArticle,
    markArticleOutdated,
    unmarkArticleOutdated,
    deleteArticle,
    setCurrentTags
})

@highlight(false)
@withStyles(styles)
class ArticleShow extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        initialData: PropTypes.object,
        // from connect
        currentUser: PropTypes.object,
        currentTopic: PropTypes.object,
        isCurrentTopicOwner: PropTypes.bool,
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        isOwner: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        fetchArticle: PropTypes.func,
        updateArticle: PropTypes.func,
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
        this._request = this.props.fetchArticle(this.props.params.articleSlug);
    }

    componentDidUpdate(prevProps) {
        if (this.props.article) {
            this.props.setCurrentTags(this.props.article.tags);

            // Highlight code
            this.props.onShow(this.props.article.id, true);
        }

        if (!Object.equals(this.props.params, prevProps.params)) {
            this._request = this.props.fetchArticle(this.props.params.articleSlug);
        }
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    _handleOutdatedClick = (event) => {
        event.preventDefault();

        if (this.props.article.outdated) {
            this.props.unmarkArticleOutdated(this.props.article.id)
                .then((response) => response && response.errors && Notification.error(response.errors, 10));
        } else {
            this.props.markArticleOutdated(this.props.article.id)
                .then((response) => response && response.errors && Notification.error(response.errors, 10));
        }
    };

    _handleVisibilityClick = (event) => {
        event.preventDefault();

        this.props.updateArticle({
            id: this.props.article.id,
            visibility: this.props.article.visibility === 'everyone' ? 'only_me' : 'everyone'
        });
    };

    _handleDeleteClick = (event) => {
        event.preventDefault();

        this.props.deleteArticle(this.props.article.id)
            .then(() => this.props.history.push({
                    pathname: `/`,
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

        return (
            <StickyContainer>
                {
                    (this.props.initialData && this.props.initialData.position && this.props.isFetching) &&
                    <div className="center margin-top-20">
                        <div className="parent">
                            <span className="transition"
                                  style={{
                                      top: this.props.initialData.position.y,
                                      left: this.props.initialData.position.x
                                  }}>
                                {this.props.initialData.title}
                            </span>
                        </div>
                    </div>
                }

                {
                    this.props.article && !this.props.isFetching &&
                    <article className={this.props.classes.root}>
                        {
                            this.props.isCurrentTopicOwner &&
                            <div className={this.props.classes.breadcrumb}>
                                <ArticleBreadcrumbDisplay user={this.props.currentUser}
                                                          topic={this.props.currentTopic}/>
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
                                                              isOwner={this.props.isOwner}
                                                              userSlug={this.props.article.user.slug}
                                                              articleId={this.props.article.id}
                                                              articleSlug={this.props.article.slug}
                                                              articleTitle={this.props.article.title}
                                                              articleVisibility={this.props.article.visibility}
                                                              onVisibilityClick={this._handleVisibilityClick}/>
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
                                              container: this.props.classes.info
                                          }}
                                          spacing={16}
                                          direction="row"
                                          justify="space-between"
                                          alignItems="center">
                                        <Grid item={true}>
                                            <ArticleAvatarIcon classes={this.props.classes}
                                                               user={this.props.article.user}
                                                               articleDate={this.props.article.date}/>
                                        </Grid>

                                        {
                                            (this.props.article.allowComment && this.props.article.visibility !== 'only_me') &&
                                            <Grid className="hide-on-small"
                                                  item={true}>
                                                <CommentCountIcon className={this.props.classes.commentCount}
                                                                  commentLink={`#article-comments-${this.props.article.id}`}
                                                                  commentsCount={this.props.article.commentsCount}
                                                                  hasIcon={false}/>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Typography className={this.props.classes.title}
                                        variant="h1">
                                {this.props.article.title}
                            </Typography>

                            <div className={classNames('normalized-content', this.props.classes.content)}
                                 dangerouslySetInnerHTML={{__html: this.props.article.content}}/>

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
                                    this.props.article.tags.size > 0 &&
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
                                                    isBookmarked={this.props.article.bookmarked}
                                                    onOutdatedClick={this._handleOutdatedClick}
                                                    onVisibilityClick={this._handleVisibilityClick}
                                                    onDeleteClick={this._handleDeleteClick}/>
                                }
                            </div>
                        </div>

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
                    </article>
                }
            </StickyContainer>
        );
    }
}
