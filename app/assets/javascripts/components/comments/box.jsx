'use strict';

import _ from 'lodash';

import CommentActions from '../../actions/commentActions';
import CommentStore from '../../stores/commentStore';

import Button from '../materialize/button';
import Pagination from '../materialize/pagination';
import CircleSpinner from '../theme/spinner/circle';

import CommentList from '../comments/list';
import CommentForm from '../comments/form';

import {CSSTransition} from 'react-transition-group';

export default class CommentBox extends Reflux.Component {
    static propTypes = {
        commentableId: PropTypes.number.isRequired,
        isConnected: PropTypes.bool.isRequired,
        isOwner: PropTypes.bool.isRequired,
        ownerId: PropTypes.number.isRequired,
        currentUserId: PropTypes.number,
        isAdmin: PropTypes.bool,
        commentableType: PropTypes.string,
        id: PropTypes.string,
        initialComments: PropTypes.array,
        commentsCount: PropTypes.number,
        isPaginated: PropTypes.bool,
        isRated: PropTypes.bool
    };

    static defaultProps = {
        currentUserId: null,
        isAdmin: false,
        commentableType: null,
        id: null,
        initialComments: [],
        commentsCount: null,
        isPaginated: false,
        isRated: true
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(CommentStore, this.onCommentChange);
    }

    state = {
        comments: [],
        commentsPagination: null,
        isLoadingComments: false,
        isCommentsLoaded: false,
        isShowingCommentForm: false
    };

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

    _handlePaginationClick = (paginate) => {
        CommentActions.loadComments({
            commentableType: this.props.commentableType,
            commentableId: this.props.commentableId,
            page: paginate.selected + 1
        });

        this.setState({isLoadingComments: true});
    };

    _handleShowFormComment = (event) => {
        event.preventDefault();
        if (this.props.isUserConnected || this.props.isAdmin) {
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
        if (this.props.isUserConnected || this.props.isAdmin) {
            if (commentId) {
                CommentActions.deleteComment(commentId, this.props.commentableId, this.props.commentableType);
            }
        } else {
            Notification.error(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    _handleCommentSubmit = (commentData) => {
        this.setState({isShowingCommentForm: false});

        if (this.props.isUserConnected || this.props.isAdmin) {
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
                 className="comments">
                <h2 className="comments-title">
                    {I18n.t('js.comment.common.title')}
                </h2>

                <div className="comments-box">
                    {
                        this.state.isLoadingComments &&
                        <CircleSpinner className="center-align"/>
                    }

                    {
                        (this.state.comments && this.state.comments.length === 0) &&
                        (
                            !this.props.isUserOwner
                                ?
                                <div className="comments-none">
                                    {I18n.t('js.comment.common.empty')}
                                </div>
                                :
                                <div className="comments-none">
                                    {I18n.t('js.comment.common.no_opinion')}
                                </div>
                        )
                    }

                    <CommentList comments={this.state.comments}
                                 isConnected={this.props.isUserConnected}
                                 isOwner={this.props.isUserOwner}
                                 currentUserId={this.props.currentUserId}
                                 ownerId={this.props.ownerId}
                                 isAdmin={this.props.isAdmin}
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

                    <CSSTransition classNames="comment-form"
                                   timeout={400}
                                   in={this.state.isShowingCommentForm}
                                   mountOnEnter={true}
                                   unmountOnExit={true}>
                        <CommentForm isOwner={this.props.isUserOwner}
                                     isRated={this.props.isRated}
                                     onCancel={this._handleCommentCancel}
                                     onSubmit={this._handleCommentSubmit}/>
                    </CSSTransition>

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

