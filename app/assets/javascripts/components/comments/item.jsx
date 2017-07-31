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
    id: PropTypes.number.isRequired,
    user: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired,
    ownerId: PropTypes.number.isRequired,
    isOwner: PropTypes.bool.isRequired,
    currentUserId: PropTypes.number,
    commentId: PropTypes.number,
    parentCommentId: PropTypes.number,
    title: PropTypes.string,
    rating: PropTypes.number,
    isModifying: PropTypes.bool,
    askedForDeletion: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    isAskingForDeletion: PropTypes.bool,
    isAdmin: PropTypes.bool
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

export default CommentItem;
