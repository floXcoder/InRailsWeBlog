'use strict';

const CommentActions = require('../../actions/commentActions');
const CommentStore = require('../../stores/commentStore');

const Waypoint = require('react-waypoint');

const Button = require('../materialize/button');
const Spinner = require('../materialize/spinner');
const Pagination = require('../materialize/pagination');

const CommentList = require('../comments/list');
const CommentForm = require('../comments/form');

const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var CommentBox = React.createClass({
    propTypes: {
        commentableId: React.PropTypes.number.isRequired,
        isUserConnected: React.PropTypes.bool.isRequired,
        currentUserId: React.PropTypes.number.isRequired,
        commentableType: React.PropTypes.string,
        id: React.PropTypes.string,
        initialComments: React.PropTypes.array,
        isPaginated: React.PropTypes.bool,
        isRated: React.PropTypes.bool
    },

    mixins: [
        Reflux.listenTo(CommentStore, 'onCommentChange')
    ],

    getDefaultProps () {
        return {
            id: null,
            commentableType: null,
            initialComments: [],
            isPaginated: false,
            isRated: true
        };
    },

    getInitialState () {
        return {
            comments: [],
            commentsPagination: null,
            isLoadingComments: false,
            isCommentsLoaded: false,
            isShowingCommentForm: false
        };
    },

    componentWillMount () {
        if (!$.isEmpty(this.props.initialComments)) {
            this.setState({
                comments: this.props.initialComments,
                isLoadingComments: false,
                isCommentsLoaded: true
            });
        }
    },

    shouldComponentUpdate (nextProps, nextState) {
        // Ignore if props has changed
        return !_.isEqual(this.state, nextState);
    },

    onCommentChange (commentData) {
        if ($.isEmpty(commentData)) {
            return;
        }

        let newState = {};

        if (commentData.type === 'loadComments') {
            newState.comments = commentData.comments;
            newState.commentsPagination = commentData.pagination;
            newState.isLoadingComments = false;
            newState.isCommentsLoaded = true;
        }

        if (commentData.type === 'addComment') {
            if (commentData.comment.parent_id) {
                let comments = [];
                this.state.comments.forEach((comment) => {
                    if (comment.id === commentData.comment.parent_id) {
                        comments.push(comment);
                        comments.push(commentData.comment);
                    } else {
                        comments.push(comment);
                    }
                });
                newState.comments = comments;
            } else {
                newState.comments = this.state.comments.concat([commentData.comment]);
            }
        }

        if (commentData.type === 'updateComment') {
            newState.comments = this.state.comments.replace('id', commentData.comment);
        }

        if (commentData.type === 'deleteComment') {
            let comments = [];
            this.state.comments.forEach((comment) => {
                if (commentData.deletedCommentIds.indexOf(comment.id) === -1) {
                    comments.push(comment);
                }
            });
            newState.comments = comments;
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _handleWaypointEnter () {
        if (!this.state.isCommentsLoaded && !this.state.isLoadingComments) {
            CommentActions.loadComments({
                commentableType: this.props.commentableType,
                commentableId: this.props.commentableId,
                isPaginated: this.props.isPaginated
            });
            this.setState({isLoadingComments: true});
        }
    },

    _handlePaginationClick(paginate)
    {
        CommentActions.loadComments({
            commentableType: this.props.commentableType,
            commentableId: this.props.commentableId,
            page: paginate.selected + 1
        });
        this.setState({isLoadingComments: true});
    },

    _handleShowFormComment (event) {
        event.preventDefault();
        if (this.props.isUserConnected) {
            this.setState({isShowingCommentForm: true});
        } else {
            Materialize.toast(I18n.t('js.comment.flash.creation_unpermitted'), 3000);
        }
    },

    _handleCommentCancel (event) {
        event.preventDefault();
        this.setState({isShowingCommentForm: false});
    },

    _handleCommentDelete (commentId) {
        if (this.props.isUserConnected) {
            if (commentId) {
                CommentActions.deleteComment(commentId, this.props.commentableId, this.props.commentableType);
            }
        } else {
            Materialize.toast(I18n.t('js.comment.flash.creation_unpermitted'), 5000);
        }
    },

    _handleCommentSubmit (commentData) {
        this.setState({isShowingCommentForm: false});

        if (this.props.isUserConnected) {
            if (commentData.id) {
                CommentActions.updateComment(commentData, this.props.commentableId, this.props.commentableType);
            } else {
                CommentActions.addComment(commentData, this.props.commentableId, this.props.commentableType);
            }
        } else {
            Materialize.toast(I18n.t('js.comment.flash.creation_unpermitted'), 5000);
        }
    },

    render () {
        return (
            <div id={this.props.id}
                 className="comments">
                <Waypoint onEnter={this._handleWaypointEnter}/>

                <h3 className="comments-title center-align">
                    {I18n.t('js.comment.common.title')}
                </h3>

                <div className="comments-box">
                    {
                        this.state.isLoadingComments &&
                        <Spinner className="center-align"/>
                    }

                    {
                        this.state.comments && this.state.comments.length === 0 &&
                        <h5 className="center-align">
                            {I18n.t('js.comment.common.empty')}
                        </h5>
                    }

                    <CommentList comments={this.state.comments}
                                 isUserConnected={this.props.isUserConnected}
                                 currentUserId={this.props.currentUserId}
                                 isRated={this.props.isRated}
                                 onDelete={this._handleCommentDelete}
                                 onSubmit={this._handleCommentSubmit}/>

                    {
                        this.state.isCommentsLoaded && !this.state.isShowingCommentForm &&
                        <div className="center-align">
                            <Button icon="comment"
                                    className="btn-full-text"
                                    iconPosition="left"
                                    onButtonClick={this._handleShowFormComment}>
                                {I18n.t('js.comment.new.button')}
                            </Button>
                        </div>
                    }

                    {
                        this.state.isShowingCommentForm &&
                        <ReactCSSTransitionGroup transitionName="comment-form"
                                                 transitionAppear={true}
                                                 transitionAppearTimeout={600}
                                                 transitionEnterTimeout={500}
                                                 transitionLeaveTimeout={300}>
                            <CommentForm isRated={this.props.isRated}
                                         onCancel={this._handleCommentCancel}
                                         onSubmit={this._handleCommentSubmit}/>
                        </ReactCSSTransitionGroup>
                    }

                    {
                        this.props.isPaginated && this.state.commentsPagination &&
                        <Pagination className="margin-top-30"
                                    totalPages={this.state.commentsPagination.total_pages}
                                    onPaginationClick={this._handlePaginationClick}/>
                    }
                </div>
            </div>
        );
    }
});

module.exports = CommentBox;
