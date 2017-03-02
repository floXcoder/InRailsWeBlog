'use strict';

import marked from 'marked';

import Rating from '../theme/rating';
import UserAvatarIcon from '../users/icons/avatar';
import CommentForm from './form';

const CommentItem = (props) => {
    if (props.isModifying) {
        return (
            <div className="comment-modify">
                <CommentForm formTitle={I18n.t('js.comment.form.title.modify')}
                             isOwner={props.isOwner}
                             isAskingForDeletion={props.isAskingForDeletion}
                             commentId={props.commentId}
                             parentCommentId={props.parentCommentId}
                             title={props.title}
                             body={props.children}
                             isRated={!!props.rating}
                             rating={props.rating}
                             onCancel={props.onCancel}
                             onSubmit={props.onSubmit}/>
            </div>
        );
    } else {
        return (
            <div id={`comment-${props.id}`}
                 className="comment-item">
                {
                    (props.ownerId === props.user.id && !props.askedForDeletion) &&
                    <span className="comment-reply-owner">
                        {I18n.t('js.comment.reply.owner')}
                    </span>
                }

                {
                    props.askedForDeletion &&
                    <span className="comment-ask-for-deletion">
                        {I18n.t('js.comment.reply.ask_for_deletion')}
                    </span>
                }

                {
                    (props.ownerId !== props.user.id && !props.askedForDeletion) &&
                    <UserAvatarIcon user={props.user}/>
                }

                <span className="comment-date">
                    {props.date}
                </span>

                {
                    props.rating > 0 &&
                    <div className="comment-rating">
                        <Rating initialRating={props.rating}/>
                    </div>
                }

                <div className="comment-title">
                    {props.title}
                </div>

                <div className="comment-body"
                     dangerouslySetInnerHTML={{__html: marked(props.children.toString(), {sanitize: true})}}/>
            </div>
        );
    }
};

CommentItem.propTypes = {
    id: React.PropTypes.number.isRequired,
    user: React.PropTypes.object.isRequired,
    date: React.PropTypes.string.isRequired,
    children: React.PropTypes.string.isRequired,
    ownerId: React.PropTypes.number.isRequired,
    isOwner: React.PropTypes.bool.isRequired,
    currentUserId: React.PropTypes.number,
    commentId: React.PropTypes.number,
    parentCommentId: React.PropTypes.number,
    title: React.PropTypes.string,
    rating: React.PropTypes.number,
    isModifying: React.PropTypes.bool,
    askedForDeletion: React.PropTypes.bool,
    onCancel: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    isAskingForDeletion: React.PropTypes.bool,
    isAdmin: React.PropTypes.bool
};

CommentItem.defaultProps = {
    currentUserId: null,
    commentId: null,
    parentCommentId: null,
    title: null,
    rating: null,
    isModifying: false,
    askedForDeletion: false,
    onCancel: null,
    onSubmit: null,
    isAskingForDeletion: false,
    isAdmin: false
};

