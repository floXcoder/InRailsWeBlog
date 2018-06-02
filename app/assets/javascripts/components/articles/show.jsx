'use strict';

import {
    fetchArticle,
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
import ArticleActions from './properties/actions';
// TODO
// import ArticleOutdatedIcon from './icons/outdated';
// TODO
// import ArticleBookmarkIcon from './icons/bookmark';
// TODO
// import ArticleVotes from './properties/vote';

import Loader from '../theme/loader';
import LazyLoader from '../theme/lazyLoader';

import CommentCountIcon from '../comments/icons/count';
import CommentBox from '../comments/box';

@connect((state) => ({
    isFetching: state.articleState.isFetching,
    article: state.articleState.article,
    isOwner: getArticleIsOwner(state, state.articleState.article),
    isOutdated: getArticleIsOutdated(state.articleState.article),
    isUserConnected: state.userState.isConnected
}), {
    fetchArticle,
    deleteArticle,
    setCurrentTags
})
@highlight(false)
export default class ArticleShow extends React.Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        // From connect
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        isOwner: PropTypes.bool,
        isOutdated: PropTypes.bool,
        isUserConnected: PropTypes.bool,
        fetchArticle: PropTypes.func,
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

    _handleDeleteClick = (event) => {
        event.preventDefault();

        this.props.deleteArticle(this.props.article.id)
            .then(() => this.props.history.push({
                    pathname: `/`,
                    state: {reloadTags: true}
                })
            );

    };

    // TODO
    _handleVisibilityClick = (articleId) => {
    };

    // TODO
    // _handleBookmarkClick = (articleId, isBookmarked) => {
    //     // ArticleActions.bookmarkArticle({articleId: articleId, isBookmarked: isBookmarked});
    // };

    // TODO
    // _handleVoteClick = (articleId, isUp) => {
    //     // ArticleActions.voteArticle({articleId: articleId, isUp: isUp});
    // };

    // TODO
    // _handleOutdatedClick = (articleId, isOutdated) => {
    //     // ArticleActions.outdateArticle({articleId: articleId, isOutdated: isOutdated});
    // };

    render() {
        if (!this.props.article) {
            return (
                <div className="center margin-top-20">
                    <Loader size="big"/>
                </div>
            )
        }

        return (
            <div>
                {
                    this.props.isOutdated &&
                    <div className="card center-align">
                        <p>
                            {I18n.t('js.article.common.outdated')}
                        </p>
                    </div>
                }

                <article className={classNames('card-panel', 'blog-article', {
                    'article-outdated': this.props.isOutdated
                })}>
                    <h1 className="blog-article-title"
                        itemProp="headline">
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
                                            onDeleteClick={this._handleDeleteClick}/>
                        </div>
                    }
                </article>

                {
                    // TODO
                    // <ArticleVotes articleId={this.props.article.id}
                    //               onVoteClick={this._handleVoteClick}
                    //               articleVotesUp={this.props.article.votesUp}
                    //               articleVotesDown={this.props.article.votesDown}/>
                }
                {
                    // TODO
                    // <ArticleBookmarkIcon articleId={this.props.article.id}
                    //                      isOwner={this.props.isUserConnected}
                    //                      onBookmarkClick={this._handleBookmarkClick}/>
                }
                {
                    // TODO
                    // <ArticleOutdatedIcon articleId={this.props.article.id}
                    //                      isOwner={this.props.isUserConnected}
                    //                      isOutdated={this.props.isOutdated}
                    //                      onOutdatedClick={this._handleOutdatedClick}/>
                }

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
        );
    }
}
