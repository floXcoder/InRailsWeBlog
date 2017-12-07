'use strict';

import CommentItem from './item';
import CommentForm from './form';

import {
    TransitionGroup,
    CSSTransition
} from 'react-transition-group';

export default class CommentList extends React.PureComponent {
    static propTypes = {
        comments: PropTypes.array.isRequired,
        isConnected: PropTypes.bool.isRequired,
        isOwner: PropTypes.bool.isRequired,
        ownerId: PropTypes.number.isRequired,
        isRated: PropTypes.bool.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        currentUserId: PropTypes.number,
        isAdmin: PropTypes.bool
    };

    static defaultProps = {
        currentUserId: null,
        isAdmin: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        modifyCommentIndex: null,
        replyCommentIndex: null,
        replyAsOwner: false,
        replyForDeletion: false
    };

    componentDidUpdate() {
        setTimeout(() => {
            $(ReactDOM.findDOMNode(this)).find('.dropdown-button').each((index, element) => {
                $(element).dropdown({
                    constrain_width: false
                });
            });
        }, 900);
    }

    _handleReplyClick = (index, isOwner, event) => {
        event.preventDefault();

        if (this.props.isConnected || this.props.isAdmin) {
            this.setState({
                replyCommentIndex: index,
                replyAsOwner: isOwner
            });
        } else {
            Notification.error(I18n.t('js.comment.flash.creation_unpermitted'));
        }
    };

    _handleAskForDeletionClick = (index, event) => {
        event.preventDefault();

        if (this.props.isOwner) {
            this.setState({
                replyCommentIndex: index,
                replyForDeletion: true
            });
        }
    };

    _handleReplyCancel = (event) => {
        event.preventDefault();

        this.setState({
            replyCommentIndex: null,
            replyAsOwner: false,
            replyForDeletion: false
        });
    };

    _handleReplySubmit = (commentData) => {
        this.setState({
            replyCommentIndex: null,
            replyAsOwner: false,
            replyForDeletion: false
        });

        this.props.onSubmit(commentData);
    };

    _handleModifyClick = (index, event) => {
        event.preventDefault();
        this.setState({modifyCommentIndex: index});
    };

    _handleModifyCancel = (event) => {
        event.preventDefault();
        this.setState({modifyCommentIndex: null});
    };

    _handleModifySubmit = (commentData) => {
        this.setState({modifyCommentIndex: null});
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

    _renderDropdown = (index, commentId, commentUserId, commentNestedLevel) => {
        if (this.props.currentUserId === commentUserId || this.props.isAdmin) {
            return (
                <ul id={`dropdown-comment-${index}`}
                    className='dropdown-content'>
                    {
                        commentNestedLevel < 4 &&
                        <li>
                            <a onClick={this._handleReplyClick.bind(this, index, this.props.isOwner)}>
                                {I18n.t(`js.comment.reply.${(this.props.isOwner ? 'owner_button' : 'button')}`)}
                            </a>
                        </li>
                    }

                    <li className="divider"/>

                    <li>
                        <a onClick={this._handleModifyClick.bind(this, index)}>
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
                <ul id={`dropdown-comment-${index}`}
                    className='dropdown-content'>
                    {
                        commentNestedLevel < 4 &&
                        <li>
                            <a onClick={this._handleReplyClick.bind(this, index, this.props.isOwner)}>
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
                            <a onClick={this._handleAskForDeletionClick.bind(this, index)}>
                                {I18n.t('js.comment.ask_for_deletion.button')}
                            </a>
                        </li>
                    }
                </ul>
            );
        }
    };

    _renderReplyForm = (index, commentId) => {
        if (this.state.replyCommentIndex === index) {
            let commentFormTitle = I18n.t('js.comment.form.title.reply');
            if (this.state.replyAsOwner) {
                commentFormTitle = I18n.t('js.comment.form.title.owner_reply');
            } else if (this.state.replyForDeletion) {
                commentFormTitle = I18n.t('js.comment.form.title.deletion_reply');
            }

            return (
                <CSSTransition classNames="comment-form"
                               timeout={400}
                               in={this.state.replyCommentIndex === index}>
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
        } else {
            return null;
        }
    };

    render() {
        if (!this.props.comments) {
            return null;
        }

        return (
            <TransitionGroup component="ul"
                             className="collection">
                {
                    this.props.comments.map((comment, index) => {
                        if (!$.isEmpty(comment.body) && (!(!this.props.isOwner && comment.ask_for_deletion) || this.props.isAdmin)) {
                            const itemClasses = classNames('collection-item', 'avatar', {
                                [`comment-child-item-${comment.nested_level}`]: comment.parent_id
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
                                                     isAdmin={this.props.isAdmin}
                                                     isAskingForDeletion={this.state.replyForDeletion}
                                                     user={comment.user}
                                                     date={comment.posted_at}
                                                     title={comment.title}
                                                     rating={this.props.isRated ? comment.rating : null}
                                                     commentId={comment.id}
                                                     parentCommentId={comment.parent_id}
                                                     isAskedForDeletion={comment.ask_for_deletion}
                                                     isModifying={this.state.modifyCommentIndex === index}
                                                     onCancel={this._handleModifyCancel}
                                                     onSubmit={this._handleModifySubmit}>
                                            {comment.body}
                                        </CommentItem>

                                        {
                                            this.state.modifyCommentIndex !== index &&
                                            <a className="btn-flat waves-effect waves-spectra secondary-content tooltipped dropdown-button"
                                               data-tooltip={I18n.t('js.comment.common.actions')}
                                               data-activates={`dropdown-comment-${index}`}>
                                                <i className="material-icons">reply</i>
                                            </a>
                                        }

                                        {this._renderDropdown(index, comment.id, comment.user.id, comment.nested_level)}
                                        {this._renderReplyForm(index, comment.id)}
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

