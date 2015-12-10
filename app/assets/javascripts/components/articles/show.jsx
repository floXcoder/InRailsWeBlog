'use strict';

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var HighlightCode = require('highlight.js');
var AnimatedText = require('../modules/animatedText');

var ArticleActions = require('../../actions/articleActions');
var ArticleStore = require('../../stores/articleStore');
var ArticleHistory = require('./history');
var ArticleLinkIcon = require('./icons/link');
var ArticleVisibilityIcon = require('./icons/visibility');
var ArticleBookmarkIcon = require('./icons/bookmark');
var ArticleHistoryIcon = require('./icons/history');
var ArticleDeleteIcon = require('./icons/delete');
var ArticleTags = require('./properties/tags');
var ArticleAuthorIcon = require('./icons/author');
var ArticleTime = require('./properties/time');

var Button = require('../materialize/button');

var CommentList = require('../comments/list');
var CommentForm = require('../comments/form');

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

    onArticleChange (articleStore) {
        if ($.isEmpty(articleStore)) {
            return;
        }

        let newState = {};

        if (typeof(articleStore.articleVersions) !== 'undefined') {
            newState.articleVersions = articleStore.articleVersions;
            if (articleStore.articleVersions.length === 0
                || (articleStore.articleVersions.length === 1 && articleStore.articleVersions[0].article.content === '')) {
                Materialize.toast(I18n.t('js.article.history.none'));
            }
        }

        if (typeof(articleStore.articleRestored) !== 'undefined') {
            newState.article = articleStore.articleRestored;
            Materialize.toast(I18n.t('js.article.history.restored'));
            this._handleHistoryClick();
        }

        if (typeof(articleStore.comment) !== 'undefined') {
            if (articleStore.comment.parent_id) {
                let comments = [];
                this.state.comments.forEach(function (comment) {
                    if (comment.id === articleStore.comment.parent_id) {
                        comments.push(comment);
                        comments.push(articleStore.comment);
                    } else {
                        comments.push(comment);
                    }
                });
                newState.comments = comments;
            } else {
                newState.comments = this.state.comments.concat([articleStore.comment]);
            }
            Materialize.toast(I18n.t('js.comment.flash.creation_successful'), 5000);
        }

        if (typeof(articleStore.updatedComment) !== 'undefined') {
            let comments = [];
            this.state.comments.forEach(function (comment) {
                if (articleStore.updatedComment.id === comment.id) {
                    comments.push(articleStore.updatedComment);
                } else {
                    comments.push(comment);
                }
            });
            newState.comments = comments;
            Materialize.toast(I18n.t('js.comment.flash.update_successful'), 5000);
        }

        if (typeof(articleStore.deletedComment) !== 'undefined') {
            let comments = [];
            this.state.comments.forEach(function (comment) {
                if (articleStore.deletedComment.id.indexOf(comment.id) === -1) {
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

    _handleHistoryClick () {
        if (this.state.isHistoryDisplayed) {
            this.setState({isHistoryDisplayed: false})
        } else {
            ArticleActions.loadArticleHistory({history: this.props.article.id});
        }

        this.state.isHistoryDisplayed = !this.state.isHistoryDisplayed;
    },

    _handleDeleteClick (event) {
        event.preventDefault();
        ArticleActions.deleteArticles({id: this.props.article.id, showMode: true});
    },

    _handleBookmarkClick (articleId, event) {
        event.preventDefault();
        ArticleActions.bookmarkArticle({articleId: articleId});
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
                ArticleActions.deleteCommentArticle(commentId, this.props.article.id);
            }
        }
    },

    _handleCommentSubmit (commentData) {
        if (!this.props.currentUserId) {
            Materialize.toast(I18n.t('js.comment.flash.creation_unpermitted'), 5000);
        } else {
            if (commentData.id) {
                ArticleActions.updateCommentArticle(commentData, this.props.article.id);
            } else {
                ArticleActions.commentArticle(commentData, this.props.article.id);
            }
        }
    },

    _renderTitle () {
        if (!$.isEmpty(this.props.article.title) || !$.isEmpty(this.props.article.summary)) {
            return (
                <AnimatedText title={this.props.article.title}
                              subtitle={this.props.article.summary}/>
            );
        }
    },

    _renderEditIcon () {
        if (this.props.currentUserId && this.props.currentUserId === this.props.article.author.id) {
            return (
                <a className="article-edit btn-floating tooltipped"
                   data-tooltip={I18n.t('js.article.tooltip.edit')}
                   href={"/articles/" + this.props.article.id + "/edit"}>
                    <i className="material-icons">mode_edit</i>
                </a>
            );
        }
    },

    render () {
        return (
            <div>
                <div className="card clearfix blog-article-item">
                    <div className="card-content">
                        <ArticleAuthorIcon article={this.props.article}/>
                        <ArticleTime article={this.props.article}/>
                        {this._renderTitle()}
                        <span className="blog-article-content"
                              dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                    </div>
                    <div className="card-action article-action row clearfix">
                        <div className="col s12 m12 l6">
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
                                                   currentUserId={this.props.currentUserId}/>
                            <ArticleHistoryIcon article={this.props.article}
                                                currentUserId={this.props.currentUserId}
                                                onClickHistory={this._handleHistoryClick}/>
                            {this._renderEditIcon()}
                        </div>
                    </div>
                </div>

                {this.state.isHistoryDisplayed &&
                <ArticleHistory articleVersions={this.state.articleVersions}/>}

                <div className="blog-article-comments">
                    <CommentList comments={this.state.comments}
                                 currentUserId={this.props.currentUserId}
                                 onDelete={this._handleCommentDelete}
                                 onSubmit={this._handleCommentSubmit}/>
                    {!this.state.showCommentForm &&
                    <div className="center-align">
                        <Button icon="comment"
                                iconPosition="left"
                                onClickButton={this._handleAddCommentButton}>
                            {I18n.t('js.comment.new.button')}
                        </Button>
                    </div>}
                    {this.state.showCommentForm &&
                    <ReactCSSTransitionGroup transitionName="comment-form"
                                             transitionAppear={true}
                                             transitionAppearTimeout={600}
                                             transitionEnterTimeout={500}
                                             transitionLeaveTimeout={300}>
                        <CommentForm refs="commentForm"
                                     onCancel={this._handleCommentCancel}
                                     onSubmit={this._handleCommentSubmit}/>
                    </ReactCSSTransitionGroup>}
                </div>

            </div>
        );
    }
});

module.exports = ArticleShow;
