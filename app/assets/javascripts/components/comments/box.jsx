'use strict';

import _ from 'lodash';

import CommentActions from '../../actions/commentActions';
import CommentStore from '../../stores/commentStore';

import Button from '../materialize/button';
import Pagination from '../materialize/pagination';
import CircleSpinner from '../theme/spinner/circle';

import CommentList from '../comments/list';
import CommentForm from '../comments/form';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class CommentBox extends Reflux.Component {
    static propTypes = {
        commentableId: React.PropTypes.number.isRequired,
        isUserConnected: React.PropTypes.bool.isRequired,
        isUserOwner: React.PropTypes.bool.isRequired,
        ownerId: React.PropTypes.number.isRequired,
        currentUserId: React.PropTypes.number,
        commentableType: React.PropTypes.string,
        id: React.PropTypes.string,
        initialComments: React.PropTypes.array,
        commentsCount: React.PropTypes.number,
        isPaginated: React.PropTypes.bool,
        isRated: React.PropTypes.bool,
        isUserAdmin: React.PropTypes.bool
    };

    static defaultProps = {
        currentUserId: null,
        id: null,
        commentableType: null,
        initialComments: [],
        commentsCount: null,
        isPaginated: false,
        isRated: true,
        isUserAdmin: false
    };

    state = {
        comments: [],
        commentsPagination: null,
        isLoadingComments: false,
        isCommentsLoaded: false,
        isShowingCommentForm: false
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(CommentStore, this.onCommentChange);
    }

    componentWillMount() {
        if (!$.isEmpty(this.props.initialComments)) {
            this.setState({
                comments: this.props.initialComments,
                isLoadingComments: false,
                isCommentsLoaded: true
            });
        } else {
            this._loadComments();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Ignore if props has changed
        return !_.isEqual(this.state, nextState);
    }

    onCommentChange(commentData) {
        if ($.isEmpty(commentData)) {
            return;
        }

        let newState = {};

        if (commentData.type === 'loadComments') {
            newState.comments = commentData.comments || [];
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
    }

    _loadComments = () => {
        if (!this.state.isCommentsLoaded && !this.state.isLoadingComments) {
            // Check if comment count is not null to avoid useless fetching
            if (!$.isEmpty(this.props.commentsCount) && this.props.commentsCount === 0) {
                this.setState({
                    isCommentsLoaded: true
                });
                return;
            }

            CommentActions.loadComments({
                commentableType: this.props.commentableType,
                commentableId: this.props.commentableId,
                isPaginated: this.props.isPaginated
            });

            this.setState({isLoadingComments: true});
        }
    };

    _handleWaypointEnter = () => {
        this._loadComments();
    };

    _handlePaginationClick(paginate) {
        CommentActions.loadComments({
            commentableType: this.props.commentableType,
            commentableId: this.props.commentableId,
            page: paginate.selected + 1
        });
        this.setState({isLoadingComments: true});
    }

    _handleShowFormComment = (event) => {
        event.preventDefault();
        if (this.props.isUserConnected || this.props.isUserAdmin) {
            this.setState({isShowingCommentForm: true});
        } else {
            Notification.error(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    _handleCommentCancel = (event) => {
        event.preventDefault();
        this.setState({isShowingCommentForm: false});
    };

    _handleCommentDelete = (commentId) => {
        if (this.props.isUserConnected || this.props.isUserAdmin) {
            if (commentId) {
                CommentActions.deleteComment(commentId, this.props.commentableId, this.props.commentableType);
            }
        } else {
            Notification.error(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    _handleCommentSubmit = (commentData) => {
        this.setState({isShowingCommentForm: false});

        if (this.props.isUserConnected || this.props.isUserAdmin) {
            if (commentData.id) {
                CommentActions.updateComment(commentData, this.props.commentableId, this.props.commentableType);
            } else {
                CommentActions.addComment(commentData, this.props.commentableId, this.props.commentableType);
            }
        } else {
            Notification.error(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    render() {
        return (
            <div id={this.props.id}
                 className="card-panel comments">
                {/*<Waypoint onEnter={this._handleWaypointEnter}/>*/}

                <h2 className="comments-title">
                    {I18n.t('js.comment.common.title')}
                </h2>

                <div className="comments-box">
                    {
                        this.state.isLoadingComments &&
                        <CircleSpinner className="center-align"/>
                    }

                    {
                        this.state.comments && this.state.comments.length === 0 &&
                        <div className="comments-none">
                            {I18n.t('js.comment.common.empty')}
                        </div>
                    }

                    <CommentList comments={this.state.comments}
                                 isUserConnected={this.props.isUserConnected}
                                 isUserOwner={this.props.isUserOwner}
                                 currentUserId={this.props.currentUserId}
                                 ownerId={this.props.ownerId}
                                 isAdmin={this.props.isUserAdmin}
                                 isRated={this.props.isRated}
                                 onDelete={this._handleCommentDelete}
                                 onSubmit={this._handleCommentSubmit}/>

                    {
                        this.state.isCommentsLoaded && !this.state.isShowingCommentForm && !this.props.isUserOwner &&
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
                            <CommentForm isOwner={this.props.isUserOwner}
                                         isRated={this.props.isRated}
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
}

