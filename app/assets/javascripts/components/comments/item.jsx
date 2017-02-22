'use strict';

const marked = require('marked');

const Rating = require('../theme/rating');
const UserAvatarIcon = require('../users/icons/avatar');
const CommentForm = require('./form');

var CommentItem = (props) => {
    if (props.isModifying) {
        return (
            <div className="comment-modify">
                <CommentForm formTitle={I18n.t('js.comment.form.title.modify')}
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
                <UserAvatarIcon user={props.user}/>

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
    commentId: React.PropTypes.number,
    parentCommentId: React.PropTypes.number,
    title: React.PropTypes.string,
    rating: React.PropTypes.number,
    isModifying: React.PropTypes.bool,
    onCancel: React.PropTypes.func,
    onSubmit: React.PropTypes.func
};

CommentItem.defaultProps = {
    commentId: null,
    parentCommentId: null,
    title: null,
    rating: null,
    isModifying: false,
    onCancel: null,
    onSubmit: null
};

module.exports = CommentItem;
