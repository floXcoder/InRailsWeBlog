import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Button from '@mui/material/Button';

import CommentIcon from '@mui/icons-material/Comment';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';
import Notification from '@js/modules/notification';

import {
    fetchComments,
    addComment,
    updateComment,
    deleteComment
} from '@js/actions/commentActions';

import {
    getIsPrimaryUser
} from '@js/selectors/userSelectors';

import Pagination from '@js/components/theme/pagination';
import CircleSpinner from '@js/components/theme/spinner/circle';

import CommentList from '@js/components/comments/list';
import CommentForm from '@js/components/comments/form';

import '@css/components/comment.scss';


class CommentBox extends React.Component {
    static propTypes = {
        commentableId: PropTypes.number.isRequired,
        ownerId: PropTypes.number.isRequired,
        isUserOwner: PropTypes.bool.isRequired,
        commentableType: PropTypes.string,
        id: PropTypes.string,
        commentsCount: PropTypes.number,
        isPaginated: PropTypes.bool,
        isRated: PropTypes.bool,
        showSignup: PropTypes.func,
        // from connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        isSuperUserConnected: PropTypes.bool,
        comments: PropTypes.array,
        commentsPagination: PropTypes.object,
        isLoadingComments: PropTypes.bool,
        fetchComments: PropTypes.func,
        addComment: PropTypes.func,
        updateComment: PropTypes.func,
        deleteComment: PropTypes.func
    };

    static defaultProps = {
        isUserConnected: false,
        isSuperUserConnected: false,
        isPaginated: false,
        isRated: true
    };

    constructor(props) {
        super(props);
    }

    state = {
        isCommentsLoaded: false,
        isShowingCommentForm: false
    };

    componentDidMount() {
        if (!this.state.isCommentsLoaded) {
            this._loadComments();
        }
    }

    _loadComments = () => {
        if (!this.state.isCommentsLoaded && !this.props.isLoadingComments) {
            // Check if comment count is not null to avoid useless fetching
            if (Utils.isPresent(this.props.commentsCount) && this.props.commentsCount === 0) {
                this.setState({
                    isCommentsLoaded: true
                });

                return;
            }

            this.props.fetchComments({
                commentableType: this.props.commentableType,
                commentableId: this.props.commentableId,
                isPaginated: this.props.isPaginated
            })
                .fetch
                .then(() => this.setState({
                    isCommentsLoaded: true
                }));
        }
    };

    _handlePaginationClick = (paginate) => {
        this.props.fetchComments({
            commentableType: this.props.commentableType,
            commentableId: this.props.commentableId,
            page: paginate.selected + 1
        });
    };

    _handleShowFormComment = (event) => {
        event.preventDefault();

        if (this.props.isUserConnected || this.props.isSuperUserConnected) {
            this.setState({isShowingCommentForm: true});
        } else {
            if (this.props.showSignup) {
                this.props.showSignup(true);
            }
            Notification.alert(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    _handleCommentCancel = (event) => {
        event.preventDefault();
        this.setState({isShowingCommentForm: false});
    };

    _handleCommentDelete = (commentId) => {
        if (this.props.isUserConnected || this.props.isSuperUserConnected) {
            if (commentId) {
                this.props.deleteComment(commentId, this.props.commentableType, this.props.commentableId);
            }
        } else {
            Notification.alert(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    _handleCommentSubmit = (commentData) => {
        this.setState({isShowingCommentForm: false});

        if (this.props.isUserConnected || this.props.isSuperUserConnected) {
            if (commentData.id) {
                this.props.updateComment(commentData, this.props.commentableType, this.props.commentableId);
            } else {
                this.props.addComment(commentData, this.props.commentableType, this.props.commentableId);
            }
        } else {
            Notification.alert(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    render() {
        return (
            <div id={this.props.id}
                 className="comments">
                <hr className="separation"/>

                <h2 className="title">
                    {I18n.t('js.comment.common.title')}
                </h2>

                <div className="content">
                    {
                        !!this.props.isLoadingComments &&
                        <CircleSpinner className="center-align"/>
                    }

                    {
                        !!(this.props.comments && this.props.comments.length === 0 && !this.state.isShowingCommentForm) &&
                        (
                            this.props.isUserOwner
                                ?
                                <div className="headline">
                                    {I18n.t('js.comment.common.no_opinion')}
                                </div>
                                :
                                <div className="headline">
                                    {I18n.t('js.comment.common.empty')}
                                </div>
                        )
                    }

                    <CommentList comments={this.props.comments}
                                 isConnected={this.props.isUserConnected}
                                 isOwner={this.props.isUserOwner}
                                 isRated={this.props.isRated}
                                 ownerId={this.props.ownerId}
                                 currentUserId={this.props.currentUserId}
                                 isSuperUser={this.props.isSuperUserConnected}
                                 onDelete={this._handleCommentDelete}
                                 onSubmit={this._handleCommentSubmit}/>

                    {
                        !!(this.state.isCommentsLoaded && !this.state.isShowingCommentForm && !this.props.isUserOwner) &&
                        <div className="center-align margin-top-20">
                            <Button color="primary"
                                    variant="outlined"
                                    size="small"
                                    onClick={this._handleShowFormComment}>
                                <CommentIcon className="left-icon"/>
                                {I18n.t('js.comment.new.button')}
                            </Button>
                        </div>
                    }

                    <CommentForm isOwner={this.props.isUserOwner}
                                 isRated={this.props.isRated}
                                 onCancel={this._handleCommentCancel}
                                 onSubmit={this._handleCommentSubmit}/>

                    {
                        !!(this.props.isPaginated && this.props.commentsPagination) &&
                        <Pagination className="margin-top-30"
                                    totalPages={this.props.commentsPagination.totalPages}
                                    onPaginationClick={this._handlePaginationClick}/>
                    }
                </div>
            </div>
        );
    }
}

export default connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    isSuperUserConnected: getIsPrimaryUser(state),
    comments: state.commentState.comments,
    commentsPagination: state.commentState.pagination,
    isLoadingComments: state.commentState.isFetching
}), {
    fetchComments,
    addComment,
    updateComment,
    deleteComment
})(CommentBox);