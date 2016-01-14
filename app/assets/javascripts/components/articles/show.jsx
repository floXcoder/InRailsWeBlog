'use strict';

var HighlightCode = require('highlight.js');

var AnimatedText = require('../theme/animated-text');

var UserStore = require('../../stores/userStore');

var ArticleActions = require('../../actions/articleActions');
var ArticleStore = require('../../stores/articleStore');
var ArticleHistory = require('./history');
var ArticleCommentIcon = require('./icons/comment');
var ArticleLinkIcon = require('./icons/link');
var ArticleVisibilityIcon = require('./icons/visibility');
var ArticleBookmarkIcon = require('./icons/bookmark');
var ArticleHistoryIcon = require('./icons/history');
var ArticleDeleteIcon = require('./icons/delete');
var ArticleTags = require('./properties/tags');
var ArticleTime = require('./properties/time');

var UserAvatarIcon = require('../users/icons/avatar');

var CommentBox = require('../comments/box');

var ArticleShow = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        currentUserId: React.PropTypes.number
    },

    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange')
    ],

    getDefaultProps () {
        return {
            currentUserId: null
        };
    },

    getInitialState () {
        return {
            article: this.props.article,
            articleVersions: null,
            isHistoryDisplayed: false,
            comments: this.props.article.comments,
            showCommentForm: false
        };
    },

    componentDidMount () {
        // Display tooltips
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function () {
            $(this).tooltip();
        });

        // Highlight code in article content
        HighlightCode.configure({
            tabReplace: '  ' // 2 spaces
        });
        this._highlightCode();
    },

    componentDidUpdate () {
        $(ReactDOM.findDOMNode(this)).find('.tooltipped').each(function () {
            $(this).tooltip();
        });
        this._highlightCode();
    },

    _highlightCode () {
        let domNode = ReactDOM.findDOMNode(this);
        let nodes = domNode.querySelectorAll('pre code');
        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i = i + 1) {
                HighlightCode.highlightBlock(nodes[i]);
            }
        }
    },

    onArticleChange (articleData) {
        if ($.isEmpty(articleData)) {
            return;
        }

        let newState = {};

        if (typeof(articleData.articleVersions) !== 'undefined') {
            newState.articleVersions = articleData.articleVersions;
            if (articleData.articleVersions.length === 0
                || (articleData.articleVersions.length === 1 && articleData.articleVersions[0].article.content === '')) {
                Materialize.toast(I18n.t('js.article.history.none'));
            }
        }

        if (typeof(articleData.articleRestored) !== 'undefined') {
            newState.article = articleData.articleRestored;
            Materialize.toast(I18n.t('js.article.history.restored'));
            this._handleHistoryClick();
        }

        if (typeof(articleData.comment) !== 'undefined') {
            if (articleData.comment.parent_id) {
                let comments = [];
                this.state.comments.forEach(function (comment) {
                    if (comment.id === articleData.comment.parent_id) {
                        comments.push(comment);
                        comments.push(articleData.comment);
                    } else {
                        comments.push(comment);
                    }
                });
                newState.comments = comments;
            } else {
                newState.comments = this.state.comments.concat([articleData.comment]);
            }
            Materialize.toast(I18n.t('js.comment.flash.creation_successful'), 5000);
        }

        if (typeof(articleData.updatedComment) !== 'undefined') {
            let comments = [];
            this.state.comments.forEach(function (comment) {
                if (articleData.updatedComment.id === comment.id) {
                    comments.push(articleData.updatedComment);
                } else {
                    comments.push(comment);
                }
            });
            newState.comments = comments;
            Materialize.toast(I18n.t('js.comment.flash.update_successful'), 5000);
        }

        if (typeof(articleData.deletedComment) !== 'undefined') {
            let comments = [];
            this.state.comments.forEach(function (comment) {
                if (articleData.deletedComment.id.indexOf(comment.id) === -1) {
                    comments.push(comment);
                }
            });
            newState.comments = comments;
            Materialize.toast(I18n.t('js.comment.flash.deletion_successful'), 5000);
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _handleAuthorClick (userId, event) {
        UserStore.onTrackClick(userId);
        return event;
    },

    _handleHistoryClick () {
        if (this.state.isHistoryDisplayed) {
            this.setState({isHistoryDisplayed: false})
        } else {
            ArticleActions.loadArticleHistory({history: this.state.article.id});
        }

        this.state.isHistoryDisplayed = !this.state.isHistoryDisplayed;
    },

    _handleDeleteClick (event) {
        event.preventDefault();
        ArticleActions.deleteArticle({id: this.state.article.id, showMode: true});
    },

    _handleBookmarkClick (articleId, isBookmarked) {
        ArticleActions.bookmarkArticle({articleId: articleId, isBookmarked: isBookmarked});
    },

    _handleAddCommentButton (event) {
        event.preventDefault();
        if (!this.props.currentUserId) {
            Materialize.toast(I18n.t('js.comment.flash.creation_unpermitted'), 5000);
        } else {
            this.setState({showCommentForm: true});
        }
    },

    _handleCommentCancel (event) {
        event.preventDefault();
        this.setState({showCommentForm: false});
    },

    _handleCommentDelete (commentId) {
        if (!this.props.currentUserId) {
            Materialize.toast(I18n.t('js.comment.flash.creation_unpermitted'), 5000);
        } else {
            if (commentId) {
                ArticleActions.deleteComment(commentId, this.state.article.id);
            }
        }
    },

    _handleCommentSubmit (commentData) {
        if (!this.props.currentUserId) {
            Materialize.toast(I18n.t('js.comment.flash.creation_unpermitted'), 5000);
        } else {
            if (commentData.id) {
                ArticleActions.updateComment(commentData, this.state.article.id);
            } else {
                ArticleActions.addComment(commentData, this.state.article.id);
            }
        }
    },

    render () {
        return (
            <div>
                <div className="card blog-article-item clearfix">
                    <div className="card-content">
                        <UserAvatarIcon user={this.props.article.author}
                                        className="article-author"/>
                        <div className="article-info right-align">
                            <ArticleTime article={this.props.article}/>
                            <ArticleCommentIcon articleLink={'/articles/' + this.state.article.slug}
                                                commentsNumber={this.props.article.comments_number}/>
                        </div>
                        {(!$.isEmpty(this.props.article.title) || !$.isEmpty(this.props.article.summary)) &&
                        <AnimatedText title={this.props.article.title}
                                      subtitle={this.props.article.summary}/>}
                        <span className="blog-article-content"
                              dangerouslySetInnerHTML={{__html: this.state.article.content}}/>
                    </div>
                    <div className="card-action article-action clearfix">
                        <div className="row">
                            <div className="col s12 m12 l6 md-margin-bottom-20">
                                <ArticleTags article={this.props.article}/>
                            </div>
                            <div className="col s12 m12 l6 right-align">
                                <ArticleDeleteIcon article={this.props.article}
                                                   currentUserId={this.props.currentUserId}
                                                   onClickDelete={this._handleDeleteClick}/>
                                <ArticleBookmarkIcon article={this.props.article}
                                                     currentUserId={this.props.currentUserId}
                                                     onClickBookmark={this._handleBookmarkClick}/>
                                <ArticleLinkIcon isLink={this.props.article.is_link}/>
                                <ArticleVisibilityIcon article={this.props.article}
                                                       floatingButton={true}
                                                       currentUserId={this.props.currentUserId}/>
                                <ArticleHistoryIcon article={this.props.article}
                                                    currentUserId={this.props.currentUserId}
                                                    onClickHistory={this._handleHistoryClick}/>
                                {(this.props.currentUserId && this.props.currentUserId === this.state.article.author.id) &&
                                <a className="article-edit btn-floating tooltipped"
                                   data-tooltip={I18n.t('js.article.tooltip.edit')}
                                   href={"/articles/" + this.state.article.id + "/edit"}>
                                    <i className="material-icons">mode_edit</i>
                                </a>}
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.isHistoryDisplayed &&
                <ArticleHistory articleVersions={this.state.articleVersions}/>}

                {this.props.article.allow_comment &&
                <div id="comments">
                    <CommentBox comments={this.state.comments}
                                currentUserId={this.props.currentUserId}
                                isRated={false}
                                onDelete={this._handleCommentDelete}
                                onSubmit={this._handleCommentSubmit}/>
                </div>}
            </div>
        );
    }
});

module.exports = ArticleShow;
