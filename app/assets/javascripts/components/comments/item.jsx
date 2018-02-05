'use strict';

import marked from 'marked';

import Dropdown from '../theme/dropdown';
import Rating from '../theme/rating';
import UserAvatarIcon from '../users/icons/avatar';

import CommentForm from './form';

export default class CommentItem extends React.Component {
    static propTypes = {
        id: PropTypes.number.isRequired,
        comment: PropTypes.object.isRequired,
        currentUserId: PropTypes.number,
        isOwner: PropTypes.bool.isRequired,
        ownerId: PropTypes.number.isRequired,
        isConnected: PropTypes.bool,
        isSuperUser: PropTypes.bool,
        isAskingForDeletion: PropTypes.bool,
        onDropdownClick: PropTypes.func,
        onSubmit: PropTypes.func.isRequired,
        onReply: PropTypes.func.isRequired,
        onAskForDeletion: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired
    };

    static defaultProps = {
        isConnected: false,
        isSuperUser: false,
        isAskingForDeletion: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        isModifying: false
    };

    _handleModifyClick = (event) => {
        event.preventDefault();

        this.setState({
            isModifying: true
        });
    };

    _handleModifyCancel = (event) => {
        event.preventDefault();

        this.setState({
            isModifying: false
        });
    };

    _handleModifySubmit = (commentData) => {
        this.setState({
            isModifying: false
        });

        this.props.onSubmit(commentData);
    };

    _handleReplyClick = (event) => {
        event.preventDefault();

        this.props.onReply(this.props.comment.id);
    };

    _handleDeleteClick = (event) => {
        event.preventDefault();

        Notification.alert(I18n.t('js.comment.delete.confirmation_message'), 10, I18n.t('js.comment.delete.confirmation_button'), () => {
            this.props.onDelete(this.props.comment.id);
        });
    };

    _handleAskForDeletionClick = (event) => {
        event.preventDefault();

        this.props.onAskForDeletion(this.props.comment.id);
    };

    render() {
        if (this.state.isModifying) {
            return (
                <div className="comment-modify">
                    <CommentForm formTitle={I18n.t('js.comment.form.title.modify')}
                                 isOwner={this.props.isOwner}
                                 isAskingForDeletion={this.props.isAskingForDeletion}
                                 commentId={this.props.comment.id}
                                 parentCommentId={this.props.comment.parentId}
                                 title={this.props.comment.title}
                                 body={this.props.comment.body}
                                 isRated={!!this.props.comment.rating}
                                 rating={this.props.comment.rating}
                                 onCancel={this._handleModifyCancel}
                                 onSubmit={this._handleModifySubmit}/>
                </div>
            );
        } else {
            const isOwnerComment = (this.props.ownerId === this.props.comment.user.id);

            return (
                <div id={`comment-${this.props.id}`}
                     className="comment-item">
                    {
                        this.props.comment.askForDeletion
                            ?
                            <span className="comment-ask-for-deletion">
                                {I18n.t('js.comment.reply.ask_for_deletion')}
                            </span>
                            :
                            isOwnerComment
                                ?
                                <span className="comment-reply-owner">
                                {I18n.t('js.comment.reply.owner')}
                            </span>
                                :
                                <UserAvatarIcon user={this.props.comment.user}/>
                    }

                    <span className="comment-date">
                    {this.props.comment.postedAt}
                </span>

                    {
                        this.props.comment.rating > 0 &&
                        <div className="comment-rating">
                            <Rating initialRating={this.props.comment.rating}/>
                        </div>
                    }

                    <div className="comment-title">
                        {this.props.comment.title}
                    </div>

                    <div className="comment-body"
                         dangerouslySetInnerHTML={{__html: marked(this.props.comment.body.toString(), {sanitize: true})}}/>

                    <div className="secondary-content">
                        <Dropdown tooltip={I18n.t('js.comment.common.actions')}
                                  button={<span className="material-icons"
                                                data-icon="reply"
                                                aria-hidden="true"/>}>
                            {
                                (this.props.currentUserId === this.props.comment.user.id || this.props.isSuperUser)
                                    ?
                                    <ul>
                                        {
                                            this.props.comment.nestedLevel < 4 &&
                                            <li>
                                                <a onClick={this._handleReplyClick}>
                                                    {I18n.t(`js.comment.reply.${(this.props.isOwner ? 'owner_button' : 'button')}`)}
                                                </a>
                                            </li>
                                        }

                                        <li className="divider"/>

                                        <li>
                                            <a onClick={this._handleModifyClick}>
                                                {I18n.t('js.comment.edit.button')}
                                            </a>
                                        </li>

                                        <li className="divider"/>

                                        <li>
                                            <a onClick={this._handleDeleteClick}>
                                                {I18n.t('js.comment.delete.button')}
                                            </a>
                                        </li>
                                    </ul>
                                    :
                                    <ul>
                                        {
                                            this.props.comment.nestedLevel < 4 &&
                                            <li>
                                                <a onClick={this._handleReplyClick}>
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
                                                <a onClick={this._handleAskForDeletionClick}>
                                                    {I18n.t('js.comment.ask_for_deletion.button')}
                                                </a>
                                            </li>
                                        }
                                    </ul>
                            }
                        </Dropdown>
                    </div>
                </div>
            );
        }
    }
};
