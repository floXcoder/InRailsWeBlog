'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    StickyContainer,
    Sticky
} from 'react-sticky';

import {
    fetchArticle,
    updateArticle,
    markArticleOutdated,
    unmarkArticleOutdated,
    deleteArticle,
    setCurrentTags
} from '../../actions';

import {
    getArticleIsOwner,
    getArticleIsOutdated
} from '../../selectors';

import highlight from '../modules/highlight';

import ArticleUserIcon from './icons/user';
import ArticleTime from './properties/time';
import ArticleTags from './properties/tags';
import ArticleFloatingIcons from './properties/floatingIcons';
import ArticleActions from './properties/actions';

import Loader from '../theme/loader';
import LazyLoader from '../theme/lazyLoader';

import CommentCountIcon from '../comments/icons/count';

import CommentBox from '../loaders/commentBox';

import NotFound from '../layouts/notFound';

export default @connect((state) => ({
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
@hot(module)
class ArticleShow extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // From connect
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        isOwner: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        fetchArticle: PropTypes.func,
        updateArticle: PropTypes.func,
        markArticleOutdated: PropTypes.func,
        unmarkArticleOutdated: PropTypes.func,
        deleteArticle: PropTypes.func,
        setCurrentTags: PropTypes.func
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
        if (!this.props.article) {
            if (this.props.isFetching) {
                return (
                    <div className="center margin-top-20">
                        <Loader size="big"/>
                    </div>
                )
            } else {
                return (
                    <div className="center margin-top-20">
                        <NotFound/>
                    </div>
                )
            }
        }

        return (
            <StickyContainer>
                <div>
                    {
                        this.props.isUserConnected &&
                        <div className="article-floating-container">
                            <Sticky topOffset={-50}
                                    bottomOffset={0}>
                                {({style, isSticky}) => (
                                    <ArticleFloatingIcons style={style}
                                                          isSticky={isSticky}
                                                          isOwner={this.props.isOwner}
                                                          articleId={this.props.article.id}
                                                          articleSlug={this.props.article.slug}
                                                          articleTitle={this.props.article.title}/>
                                )}
                            </Sticky>
                        </div>
                    }

                    <article className={classNames('card-panel', 'blog-article', {
                        'article-outdated': this.props.article.outdated
                    })}>
                        <h1 className="blog-article-title">
                            {this.props.article.title}
                        </h1>

                        {
                            this.props.article.summary &&
                            <h2 className="blog-article-summary">
                                {this.props.article.summary}
                            </h2>
                        }

                        <div className="blog-article-info">
                            <ArticleUserIcon user={this.props.article.user}/>

                            <span className="blog-article-info-sep">-</span>

                            <ArticleTime articleDate={this.props.article.date}/>

                            {
                                this.props.article.visibility === 'everyone' &&
                                <CommentCountIcon commentLink={`#article-comments-${this.props.article.id}`}
                                                  commentsCount={this.props.article.commentsCount}/>
                            }
                        </div>

                        <div className="blog-article-content"
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

                        {
                            this.props.article.tags.size > 0 &&
                            <div className="blog-article-info">
                                <ArticleTags articleId={this.props.article.id}
                                             tags={this.props.article.tags}
                                             parentTagIds={this.props.article.parentTagIds}
                                             childTagIds={this.props.article.childTagIds}/>
                            </div>
                        }

                        {
                            this.props.isOwner &&
                            <div className="article-actions">
                                <div className="article-actions-text">
                                    {I18n.t('js.article.common.actions')}
                                </div>

                                <ArticleActions articleId={this.props.article.id}
                                                articleSlug={this.props.article.slug}
                                                articleTitle={this.props.article.title}
                                                articleVisibility={this.props.article.visibility}
                                                isOutdated={this.props.article.outdated}
                                                isBookmarked={this.props.article.bookmarked}
                                                onOutdatedClick={this._handleOutdatedClick}
                                                onVisibilityClick={this._handleVisibilityClick}
                                                onDeleteClick={this._handleDeleteClick}/>
                            </div>
                        }
                    </article>

                    {
                        (this.props.article.allowComment && this.props.article.visibility !== 'only_me') &&
                        <div className="card-panel">
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
                        </div>
                    }
                </div>
            </StickyContainer>
        );
    }
}
