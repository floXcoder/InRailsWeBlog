'use strict';

import {
    marked
} from 'marked';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import ReplyIcon from '@mui/icons-material/Reply';

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
        isSuperUser: PropTypes.bool,
        isAskingForDeletion: PropTypes.bool,
        onSubmit: PropTypes.func.isRequired,
        onReply: PropTypes.func.isRequired,
        onAskForDeletion: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired
    };

    static defaultProps = {
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

        Notification.message.alert(I18n.t('js.comment.delete.confirmation_message'), I18n.t('js.comment.delete.confirmation_button'), this.props.onDelete.bind(this, this.props.comment.id));
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
                    <div className="comment-item-header">
                        <div className="header-avatar">
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
                                        <UserAvatarIcon className="header-avatar-user"
                                                        user={this.props.comment.user}
                                                        secondary={
                                                            <span className="comment-date">
                                                                {this.props.comment.postedAt}
                                                            </span>
                                                        }/>
                            }
                        </div>

                        <div className="header-action">
                            <Dropdown id="comment-actions"
                                      hasArrow={true}
                                      // tooltip={I18n.t('js.comment.common.actions')}
                                      button={
                                          <ReplyIcon color="primary"/>
                                      }>
                                {
                                    (this.props.currentUserId === this.props.comment.user.id || this.props.isSuperUser)
                                        ?
                                        <List component="div"
                                              disablePadding={true}>
                                            {
                                                this.props.comment.nestedLevel < 4 &&
                                                <ListItem button={true}
                                                          component="a"
                                                          onClick={this._handleReplyClick}>
                                                    <ListItemText>
                                                        {I18n.t(`js.comment.reply.${(this.props.isOwner ? 'owner_button' : 'button')}`)}
                                                    </ListItemText>
                                                </ListItem>
                                            }

                                            <Divider/>

                                            <ListItem button={true}
                                                      component="a"
                                                      onClick={this._handleModifyClick}>
                                                <ListItemText>
                                                    {I18n.t('js.comment.edit.button')}
                                                </ListItemText>
                                            </ListItem>

                                            <Divider/>

                                            <ListItem button={true}
                                                      component="a"
                                                      onClick={this._handleDeleteClick}>
                                                <ListItemText>
                                                    {I18n.t('js.comment.delete.button')}
                                                </ListItemText>
                                            </ListItem>
                                        </List>
                                        :
                                        <List component="div"
                                              disablePadding={true}>
                                            {
                                                this.props.comment.nestedLevel < 4 &&
                                                <ListItem button={true}
                                                          component="a"
                                                          onClick={this._handleReplyClick}>
                                                    <ListItemText>
                                                        {I18n.t(`js.comment.reply.${(this.props.isOwner ? 'owner_button' : 'button')}`)}
                                                    </ListItemText>
                                                </ListItem>
                                            }

                                            {
                                                this.props.isOwner &&
                                                <>
                                                    <Divider/>

                                                    <ListItem button={true}
                                                              component="a"
                                                              onClick={this._handleAskForDeletionClick}>
                                                        <ListItemText>
                                                            {I18n.t('js.comment.ask_for_deletion.button')}
                                                        </ListItemText>
                                                    </ListItem>
                                                </>
                                            }
                                        </List>
                                }
                            </Dropdown>
                        </div>
                    </div>

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
                </div>
            );
        }
    }
}
