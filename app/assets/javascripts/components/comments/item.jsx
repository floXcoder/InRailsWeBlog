'use strict';

var marked = require('marked');
var Rating = require('../theme/rating');
var CommentForm = require('./form');

var CommentItem = React.createClass({
    propTypes: {
        author: React.PropTypes.string.isRequired,
        authorUrl: React.PropTypes.string.isRequired,
        date: React.PropTypes.string.isRequired,
        children: React.PropTypes.string.isRequired,
        commentId: React.PropTypes.number,
        parentCommentId: React.PropTypes.number,
        title: React.PropTypes.string,
        rating: React.PropTypes.number,
        isModifying: React.PropTypes.bool,
        onCancel: React.PropTypes.func,
        onSubmit: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            commentId: null,
            parentCommentId: null,
            title: null,
            rating: null,
            isModifying: false,
            onCancel: null,
            onSubmit: null
        };
    },

    _rawMarkup () {
        let rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return {__html: rawMarkup};
    },

    render () {
        if (this.props.isModifying) {
            return (
                <div className="comment-modify">
                    <CommentForm refs="commentForm"
                                 formTitle={I18n.t('js.comment.form.title.modify')}
                                 commentId={this.props.commentId}
                                 parentCommentId={this.props.parentCommentId}
                                 title={this.props.title}
                                 message={this.props.children}
                                 isRated={!!this.props.rating}
                                 rating={this.props.rating}
                                 onCancel={this.props.onCancel}
                                 onSubmit={this.props.onSubmit}/>
                </div>
            );
        } else {
            return (
                <div className="comment-item">
                    <span className="title comment-user">
                        <a href={`/users/${this.props.authorUrl}`}>
                            {this.props.author}
                        </a>
                    </span>
                    <span className="comment-date">
                        {this.props.date}
                    </span>

                    {this.props.rating &&
                    <div className="comment-rating">
                        <Rating initialRating={this.props.rating}
                                readOnly={true}/>
                    </div>}

                    <div className="comment-title">
                        {this.props.title}
                    </div>
                    <div dangerouslySetInnerHTML={this._rawMarkup()}/>
                </div>
            );
        }
    }
});

module.exports = CommentItem;
