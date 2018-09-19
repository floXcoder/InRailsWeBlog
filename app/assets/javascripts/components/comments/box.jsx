'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    CSSTransition
} from 'react-transition-group';

import {
    fetchComments,
    addComment,
    updateComment,
    deleteComment
} from '../../actions';

import {
    getIsPrimaryUser,
    getComments,
    getCommentPagination
} from '../../selectors';

import Button from '../materialize/button';
import Pagination from '../materialize/pagination';
import CircleSpinner from '../theme/spinner/circle';

import CommentList from '../comments/list';
import CommentForm from '../comments/form';

export default @connect((state, props) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    isSuperUserConnected: getIsPrimaryUser(state),
    comments: props.initialComments || getComments(state),
    commentsPagination: getCommentPagination(state),
    isLoadingComments: !!props.initialComments || state.commentState.isFetching
}), {
    fetchComments,
    addComment,
    updateComment,
    deleteComment
})
@hot(module)
class CommentBox extends React.Component {
    static propTypes = {
        commentableId: PropTypes.number.isRequired,
        ownerId: PropTypes.number.isRequired,
        isUserOwner: PropTypes.bool.isRequired,
        commentableType: PropTypes.string,
        id: PropTypes.string,
        initialComments: PropTypes.array,
        commentsCount: PropTypes.number,
        isPaginated: PropTypes.bool,
        isRated: PropTypes.bool,
        // From connect
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
        initialComments: [],
        isPaginated: false,
        isRated: true
    };

    constructor(props) {
        super(props);
    }

    state = {
        isCommentsLoaded: !Utils.isEmpty(this.props.initialComments),
        isShowingCommentForm: false
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.initialComments !== nextProps.comments) {
            return {
                ...prevState,
                isCommentsLoaded: true
            };
        }

        return null;
    }

    componentDidMount() {
        if (!this.state.isCommentsLoaded) {
            this._loadComments();
        }
    }

    _loadComments = () => {
        if (!this.state.isCommentsLoaded && !this.props.isLoadingComments) {
            // Check if comment count is not null to avoid useless fetching
            if (!Utils.isEmpty(this.props.commentsCount) && this.props.commentsCount === 0) {
                this.setState({
                    isCommentsLoaded: true
                });
                return;
            }

            this.props.fetchComments({
                commentableType: this.props.commentableType,
                commentableId: this.props.commentableId,
                isPaginated: this.props.isPaginated
            });
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
            Notification.error(I18n.t('js.comment.flash.creation_unpermitted'));
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
            Notification.error(I18n.t('js.comment.flash.creation_unpermitted'));
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
                        this.props.isLoadingComments &&
                        <CircleSpinner className="center-align"/>
                    }

                    {
                        (this.props.comments && this.props.comments.length === 0) &&
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
                        this.props.isPaginated && this.props.commentsPagination &&
                        <Pagination className="margin-top-30"
                                    totalPages={this.props.commentsPagination.totalPages}
                                    onPaginationClick={this._handlePaginationClick}/>
                    }
                </div>
            </div>
        );
    }
}

