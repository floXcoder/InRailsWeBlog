'use strict';

import HighlightCode from 'highlight.js';

import AnimatedText from '../theme/animated-text';

import UserStore from '../../stores/userStore';

import ArticleActions from '../../actions/articleActions';
import ArticleStore from '../../stores/articleStore';
import ArticleHistory from './history';
import CountCommentIcon from '../comments/icons/count';
import ArticleOutdatedIcon from './icons/outdated';
import ArticleVisibilityIcon from './icons/visibility';
import ArticleBookmarkIcon from './icons/bookmark';
import ArticleHistoryIcon from './icons/history';
import ArticleDeleteIcon from './icons/delete';
import ArticleTags from './properties/tags';
import ArticleTime from './properties/time';

import UserAvatarIcon from '../users/icons/avatar';

import CommentBox from '../comments/box';

import {
    Link
} from 'react-router-dom';

export default class ArticleShow extends Reflux.Component {
    static propTypes = {
        article: PropTypes.object,
        params: PropTypes.object,
        location: PropTypes.object,
    };

    static defaultProps = {
        article: null,
        params: {},
        location: {}
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(ArticleStore, this.onArticleChange);
    }

    state = {
        article: null,
        articleVersions: null,
        isHistoryDisplayed: false
    };

    componentWillMount() {
        if (this.props.article) {
            this.setState({
                article: this.props.article
            });
        } else if (this.props.params.articleSlug) {
            ArticleActions.loadArticle({slug: this.props.params.articleSlug});
        }
    }

    componentDidMount() {
        // Display tooltips
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(() => {
            $(this).tooltip();
        });

        // Highlight code in article content
        HighlightCode.configure({
            tabReplace: '  ' // 2 spaces
        });

        this._highlightCode();
    }

    componentDidUpdate() {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(() => {
            $(this).tooltip();
        });

        this._highlightCode();
    }

    onArticleChange(articleData) {
        if ($.isEmpty(articleData)) {
            return;
        }

        let newState = {};

        if (articleData.type === 'loadArticle') {
            newState.article = articleData.article;
        }

        if (articleData.type === 'loadArticleHistory') {
            newState.isHistoryDisplayed = true;
            newState.articleVersions = articleData.articleVersions;
        }

        if (articleData.type === 'restoreArticle') {
            newState.isHistoryDisplayed = false;
            newState.article = articleData.articleRestored;
            Notification.success(I18n.t('js.article.history.restored'), 10);
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    _highlightCode = () => {
        if (!this.state.article) {
            return;
        }

        let domNode = ReactDOM.findDOMNode(this);
        let nodes = domNode.querySelectorAll('pre code');
        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i = i + 1) {
                HighlightCode.highlightBlock(nodes[i]);
            }
        }
    };

    _handleUserClick = (userId, event) => {
        UserStore.onTrackClick(userId);
        return event;
    };

    _handleHistoryClick = () => {
        if (this.state.isHistoryDisplayed) {
            this.setState({isHistoryDisplayed: false});
        } else {
            ArticleActions.loadArticleHistory({history: this.state.article.id});
        }
    };

    _handleDeleteClick = (event) => {
        event.preventDefault();
        if (this.state.article) {
            ArticleActions.deleteArticle({id: this.state.article.id, showMode: true});
        }
    };

    _handleBookmarkClick = (articleId, isBookmarked) => {
        ArticleActions.bookmarkArticle({articleId: articleId, isBookmarked: isBookmarked});
    };

    _handleVoteClick = (articleId, isUp) => {
        ArticleActions.voteArticle({articleId: articleId, isUp: isUp});
    };

    _handleOutdatedClick = (articleId, isOutdated) => {
        ArticleActions.outdateArticle({articleId: articleId, isOutdated: isOutdated});
    };

    render() {
        if (this.state.article) {
            const isOutdated = this.state.article.outdated_number > 3;

            return (
                <div>
                    {
                        isOutdated &&
                        <div className="card center-align red-text">
                            <p>
                                {I18n.t('js.article.common.outdated')}
                            </p>
                        </div>
                    }

                    <div className={classNames('card blog-article-item clearfix', {'article-outdated': isOutdated})}>
                        <div className="card-content">
                            <UserAvatarIcon user={this.state.article.user}
                                            className="article-user"/>

                            <div className="article-info right-align">
                                <ArticleTime article={this.state.article}/>

                                <CountCommentIcon linkToComment={'/articles/' + this.state.article.slug}
                                                  commentsNumber={this.state.article.comments_number}/>
                            </div>

                            {
                                (!$.isEmpty(this.state.article.title) || !$.isEmpty(this.state.article.summary)) &&
                                <AnimatedText title={this.state.article.title}
                                              subtitle={this.state.article.summary}/>
                            }

                            <span className="blog-article-content"
                                  dangerouslySetInnerHTML={{__html: this.state.article.content}}/>
                        </div>

                        <div className="card-action article-action clearfix">
                            <div className="row">
                                <div className="col s12 m12 l6 md-margin-bottom-20">
                                    <ArticleTags article={this.state.article}/>

                                    <a className="btn btn-floating"
                                       onClick={this._handleVoteClick.bind(this, this.state.article.id, true)}>
                                        <i className="material-icons">thumb_up</i>
                                    </a>

                                    <a className="btn btn-floating"
                                       onClick={this._handleVoteClick.bind(this, this.state.article.id, false)}>
                                        <i className="material-icons">thumb_down</i>
                                    </a>

                                    <span>
                                        {this.state.article.votes_up}
                                    </span>

                                    <span>
                                        {this.state.article.votes_down}
                                    </span>
                                </div>

                                <div className="col s12 m12 l6 right-align">
                                    <ArticleDeleteIcon article={this.state.article}
                                                       onDeleteClick={this._handleDeleteClick}/>

                                    <ArticleBookmarkIcon article={this.state.article}
                                                         onBookmarkClick={this._handleBookmarkClick}/>

                                    <ArticleOutdatedIcon article={this.state.article}
                                                         onOutdatedClick={this._handleOutdatedClick}/>

                                    <ArticleVisibilityIcon article={this.state.article}
                                                           hasFloatingButton={true}/>

                                    <ArticleHistoryIcon article={this.state.article}
                                                        onHistoryClick={this._handleHistoryClick}/>

                                    {
                                        $app.isUserConnected(this.state.article.user.id) &&
                                        <Link className="article-edit btn-floating tooltipped"
                                              data-tooltip={I18n.t('js.article.tooltip.edit')}
                                              to={`/article/${this.state.article.id}/edit`}>
                                            <i className="material-icons">mode_edit</i>
                                        </Link>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        this.props.location.state && this.props.location.state.newTags &&
                        <div className="card-panel">
                            <p>
                                {I18n.t('js.article.show.new_tags')}
                                {
                                    this.props.location.state.newTags.map((newTag, i) =>
                                        <Link key={i}
                                              to={`/tag/${newTag.slug}`}>
                                            {newTag.name}
                                        </Link>
                                    )
                                }
                            </p>
                        </div>
                    }

                    {
                        this.state.isHistoryDisplayed && this.state.articleVersions &&
                        <ArticleHistory articleVersions={this.state.articleVersions}/>
                    }

                    {
                        this.state.article.allow_comment &&
                        <div className="card-panel">
                            <CommentBox id="comments"
                                        commentableType="articles"
                                        commentableId={this.state.article.id}
                                        isConnected={$app.isUserConnected()}
                                        currentUserId={$app.user.currentId}
                                        isPaginated={true}
                                        isRated={true}/>
                        </div>
                    }
                </div>
            );
        } else {
            return null;
        }
    }
}
