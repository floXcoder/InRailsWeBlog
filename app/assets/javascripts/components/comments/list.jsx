'use strict';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

import CommentItem from './item';
import CommentForm from './form';

export default class CommentList extends React.PureComponent {
    static propTypes = {
        comments: PropTypes.array.isRequired,
        isConnected: PropTypes.bool.isRequired,
        isOwner: PropTypes.bool.isRequired,
        isRated: PropTypes.bool.isRequired,
        ownerId: PropTypes.number.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        currentUserId: PropTypes.number,
        isSuperUser: PropTypes.bool
    };

    static defaultProps = {
        isSuperUser: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        modifyCommentId: undefined,
        replyCommentId: undefined,
        replyAsOwner: false,
        replyForDeletion: false
    };

    componentDidUpdate() {
        setTimeout(() => {
            $(ReactDOM.findDOMNode(this)).find('.dropdown-button').each((_, element) => {
                $(element).dropdown({
                    constrainWidth: false
                });
            });
        }, 900);
    }

    _handleReplyClick = (commentId, isOwner, event) => {
        event.preventDefault();

        if (this.props.isConnected || this.props.isSuperUser) {
            this.setState({
                replyCommentId: commentId,
                replyAsOwner: isOwner
            });
        } else {
            Notification.error(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    _handleAskForDeletionClick = (commentId, event) => {
        event.preventDefault();

        if (this.props.isOwner) {
            this.setState({
                replyCommentId: commentId,
                replyForDeletion: true
            });
        }
    };

    _handleReplyCancel = (event) => {
        event.preventDefault();

        this.setState({
            replyCommentId: null,
            replyAsOwner: false,
            replyForDeletion: false
        });
    };

    _handleReplySubmit = (commentData) => {
        this.setState({
            replyCommentId: null,
            replyAsOwner: false,
            replyForDeletion: false
        });

        this.props.onSubmit(commentData);
    };

    _handleModifyClick = (commentId, event) => {
        event.preventDefault();
        this.setState({
            modifyCommentId: commentId
        });
    };

    _handleModifyCancel = (event) => {
        event.preventDefault();
        this.setState({
            modifyCommentId: null
        });
    };

    _handleModifySubmit = (commentData) => {
        this.setState({
            modifyCommentId: null
        });
        this.props.onSubmit(commentData);
    };

    _handleDeleteClick = (commentId, event) => {
        event.preventDefault();

        Notification.alert(I18n.t('js.comment.delete.confirmation_message'), 10, I18n.t('js.comment.delete.confirmation_button'), () => {
            this._handleDeleteSubmit(commentId);
        });
    };

    _handleDeleteSubmit = (commentId) => {
        this.props.onDelete(commentId);
    };

    _renderDropdown = (commentId, commentUserId, commentNestedLevel) => {
        if (this.props.currentUserId === commentUserId || this.props.isSuperUser) {
            return (
                <ul id={`dropdown-comment-${commentId}`}
                    className='dropdown-content'>
                    {
                        commentNestedLevel < 4 &&
                        <li>
                            <a onClick={this._handleReplyClick.bind(this, commentId, this.props.isOwner)}>
                                {I18n.t(`js.comment.reply.${(this.props.isOwner ? 'owner_button' : 'button')}`)}
                            </a>
                        </li>
                    }

                    <li className="divider"/>

                    <li>
                        <a onClick={this._handleModifyClick.bind(this, commentId)}>
                            {I18n.t('js.comment.edit.button')}
                        </a>
                    </li>

                    <li className="divider"/>

                    <li>
                        <a onClick={this._handleDeleteClick.bind(this, commentId)}>
                            {I18n.t('js.comment.delete.button')}
                        </a>
                    </li>
                </ul>
            );
        } else {
            return (
                <ul id={`dropdown-comment-${commentId}`}
                    className='dropdown-content'>
                    {
                        commentNestedLevel < 4 &&
                        <li>
                            <a onClick={this._handleReplyClick.bind(this, commentId, this.props.isOwner)}>
                                {I18n.t(`js.comment.reply.${(this.props.isOwner ? 'owner_button' : 'button')}`)}
                            </a>
                        </li>
                    }

                    {
                        this.props.isOwner &&
                        <li className="divider"/>
                    }

                    {
                        this.props.isOwner &&
                        <li>
                            <a onClick={this._handleAskForDeletionClick.bind(this, commentId)}>
                                {I18n.t('js.comment.ask_for_deletion.button')}
                            </a>
                        </li>
                    }
                </ul>
            );
        }
    };

    _renderReplyForm = (commentId) => {
        if (this.state.replyCommentId !== commentId) {
            return null;
        }


        let commentFormTitle = I18n.t('js.comment.form.title.reply');
        if (this.state.replyAsOwner) {
            commentFormTitle = I18n.t('js.comment.form.title.owner_reply');
        } else if (this.state.replyForDeletion) {
            commentFormTitle = I18n.t('js.comment.form.title.deletion_reply');
        }

        return (
            <CSSTransition classNames="comment-form"
                           timeout={400}
                           in={this.state.replyCommentId === commentId}>
                <div>
                    <hr/>
                    <div className="comment-reply">
                        <CommentForm formTitle={commentFormTitle}
                                     parentCommentId={commentId}
                                     isOwner={this.state.replyAsOwner}
                                     isAskingForDeletion={this.state.replyForDeletion}
                                     isRated={this.props.isRated}
                                     onCancel={this._handleReplyCancel}
                                     onSubmit={this._handleReplySubmit}/>
                    </div>
                </div>
            </CSSTransition>
        );
    };

    render() {
        if (!this.props.comments) {
            return null;
        }

        return (
            <TransitionGroup component="ul"
                             className="collection">
                {
                    this.props.comments.map((comment) => {
                        if (!Utils.isEmpty(comment.body) && (!(!this.props.isOwner && comment.askForDeletion) || this.props.isSuperUser)) {
                            const itemClasses = classNames('collection-item', 'avatar', {
                                [`comment-child-item-${comment.nestedLevel}`]: comment.parentId
                            });

                            return (
                                <CSSTransition key={comment.id}
                                               timeout={500}
                                               classNames="comment">
                                    <li className={itemClasses}>
                                        <CommentItem id={comment.id}
                                                     currentUserId={this.props.currentUserId}
                                                     ownerId={this.props.ownerId}
                                                     isOwner={this.props.isOwner}
                                                     isSuperUser={this.props.isSuperUser}
                                                     isAskingForDeletion={this.state.replyForDeletion}
                                                     user={comment.user}
                                                     date={comment.postedAt}
                                                     title={comment.title}
                                                     rating={this.props.isRated ? comment.rating : null}
                                                     commentId={comment.id}
                                                     parentCommentId={comment.parentId}
                                                     isAskedForDeletion={comment.askForDeletion}
                                                     isModifying={this.state.modifyCommentId === comment.id}
                                                     onCancel={this._handleModifyCancel}
                                                     onSubmit={this._handleModifySubmit}>
                                            {comment.body}
                                        </CommentItem>

                                        {this._renderDropdown(comment.id, comment.user.id, comment.nestedLevel)}
                                        {this._renderReplyForm(comment.id)}
                                    </li>
                                </CSSTransition>
                            );
                        }
                    })
                }
            </TransitionGroup>
        );
    }
}

