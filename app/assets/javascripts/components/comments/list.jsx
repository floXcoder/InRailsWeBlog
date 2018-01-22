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
        replyCommentId: undefined,
        replyAsOwner: false,
        replyForDeletion: false
    };

    _handleReply = (commentId) => {
        if (this.props.isConnected || this.props.isSuperUser) {
            this.setState({
                replyCommentId: commentId,
                replyAsOwner: this.props.isOwner
            });
        } else {
            Notification.error(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    _handleAskForDeletion = (commentId) => {
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

    _handleModifySubmit = (commentData) => {
        this.props.onSubmit(commentData);
    };

    render() {
        if (!this.props.comments) {
            return null;
        }

        let commentFormTitle = I18n.t('js.comment.form.title.reply');
        if (this.state.replyAsOwner) {
            commentFormTitle = I18n.t('js.comment.form.title.owner_reply');
        } else if (this.state.replyForDeletion) {
            commentFormTitle = I18n.t('js.comment.form.title.deletion_reply');
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
                                                     comment={comment}
                                                     currentUserId={this.props.currentUserId}
                                                     isOwner={this.props.isOwner}
                                                     ownerId={this.props.ownerId}
                                                     isConnected={this.props.isConnected}
                                                     isSuperUser={this.props.isSuperUser}
                                                     isAskingForDeletion={this.state.replyForDeletion}
                                                     onDropdownClick={this._handleDropdownClick}
                                                     onSubmit={this._handleModifySubmit}
                                                     onReply={this._handleReply}
                                                     onAskForDeletion={this._handleAskForDeletion}
                                                     onDelete={this.props.onDelete}/>

                                        {
                                            this.state.replyCommentId === comment.id &&
                                            <CSSTransition classNames="comment-form"
                                                           timeout={400}>
                                                <div>
                                                    <hr/>
                                                    <div className="comment-reply">
                                                        <CommentForm formTitle={commentFormTitle}
                                                                     parentCommentId={comment.id}
                                                                     isOwner={this.state.replyAsOwner}
                                                                     isAskingForDeletion={this.state.replyForDeletion}
                                                                     isRated={this.props.isRated}
                                                                     onCancel={this._handleReplyCancel}
                                                                     onSubmit={this._handleReplySubmit}/>
                                                    </div>
                                                </div>
                                            </CSSTransition>
                                        }
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

