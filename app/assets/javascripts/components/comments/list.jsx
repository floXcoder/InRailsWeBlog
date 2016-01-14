'use strict';

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var classNames = require('classnames');

var CommentItem = require('./item');
var CommentForm = require('./form');

var CommentList = React.createClass({
    propTypes: {
        comments: React.PropTypes.array.isRequired,
        onSubmit: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        isRated: React.PropTypes.bool.isRequired,
        currentUserId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            currentUserId: null
        };
    },

    getInitialState () {
        return {
            modifyCommentIndex: null,
            replyCommentIndex: null
        };
    },

    componentDidUpdate () {
        $(ReactDOM.findDOMNode(this)).find('.dropdown-button').each(function () {
            $(this).dropdown();
        });
    },

    _handleReplyClick (index, event) {
        event.preventDefault();
        if (!this.props.currentUserId) {
            Materialize.toast(I18n.t('js.comment.flash.creation_unpermitted'), 5000);
        } else {
            this.setState({replyCommentIndex: index});
        }
    },

    _handleReplyCancel (event) {
        event.preventDefault();
        this.setState({replyCommentIndex: null});
    },

    _handleReplySubmit (commentData) {
        this.setState({replyCommentIndex: null});
        this.props.onSubmit(commentData);
    },

    _handleModifyClick (index, event) {
        event.preventDefault();
        this.setState({modifyCommentIndex: index});
    },

    _handleModifyCancel (event) {
        event.preventDefault();
        this.setState({modifyCommentIndex: null});
    },

    _handleModifySubmit (commentData) {
        this.setState({modifyCommentIndex: null});
        this.props.onSubmit(commentData);
    },

    _handleDeleteClick (commentId, event) {
        event.preventDefault();
        Materialize.toast(I18n.t('js.comment.delete.action'), undefined, '', function () {
            this._handleDeleteSubmit(commentId);
        }.bind(this));
    },

    _handleDeleteSubmit (commentId) {
        this.props.onDelete(commentId);
    },

    _renderDropdown (index, commentId, commentUserId, commentNestedLevel) {
        if (this.props.currentUserId === commentUserId) {
            return (
                <ul id={`dropdown-comment-${index}`}
                    className='dropdown-content'>
                    {commentNestedLevel < 4 &&
                    <li>
                        <a onClick={this._handleReplyClick.bind(this, index)}>
                            {I18n.t('js.comment.reply.button')}
                        </a>
                    </li>}
                    <li className="divider"/>
                    <li>
                        <a onClick={this._handleModifyClick.bind(this, index)}>
                            {I18n.t('js.comment.modify.button')}
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
                    {commentNestedLevel < 4 &&
                    <li>
                        <a onClick={this._handleReplyClick.bind(this, index)}>
                            {I18n.t('js.comment.reply.button')}
                        </a>
                    </li>}
                </ul>
            );
        }
    },

    _renderReplyForm (index, commentId) {
        if (this.state.replyCommentIndex === index) {
            return (
                <ReactCSSTransitionGroup transitionName="comment-form"
                                         transitionAppear={true}
                                         transitionAppearTimeout={600}
                                         transitionEnterTimeout={500}
                                         transitionLeaveTimeout={300}>
                    <hr/>
                    <div className="comment-reply">
                        <CommentForm refs="commentForm"
                                     formTitle={I18n.t('js.comment.form.title.reply')}
                                     parentCommentId={commentId}
                                     isRated={this.props.isRated}
                                     onCancel={this._handleReplyCancel}
                                     onSubmit={this._handleReplySubmit}/>
                    </div>
                </ReactCSSTransitionGroup>
            );
        } else {
            return null;
        }
    },

    render () {
        if (this.props.comments) {
            let Comments = this.props.comments.map(function (comment, index) {
                if (!$.isEmpty(comment.body)) {
                    let classes = {};
                    classes[`comment-child-item-${comment.nested_level}`] = comment.parent_id;
                    let itemClasses = classNames('collection-item', 'avatar', classes);

                    return (
                        <li key={comment.id}
                            className={itemClasses}>
                            <CommentItem id={comment.id}
                                         user={comment.user}
                                         date={comment.posted_at}
                                         title={comment.title}
                                         rating={this.props.isRated ? comment.rating : null}
                                         commentId={comment.id}
                                         parentCommentId={comment.parent_id}
                                         isModifying={this.state.modifyCommentIndex === index}
                                         onCancel={this._handleModifyCancel}
                                         onSubmit={this._handleModifySubmit}>
                                {comment.body}
                            </CommentItem>
                            {this.state.modifyCommentIndex !== index &&
                            <a className="secondary-content dropdown-button tooltipped btn-flat waves-effect waves-teal"
                               data-tooltip={I18n.t('js.comment.actions')}
                               data-activates={`dropdown-comment-${index}`}>
                                <i className="material-icons">more_vert</i>
                            </a>}
                            {this._renderDropdown(index, comment.id, comment.user.id, comment.nested_level)}
                            {this._renderReplyForm(index, comment.id)}
                        </li>
                    );
                }
            }.bind(this));

            return (
                <ReactCSSTransitionGroup transitionName="comment"
                                         transitionAppear={true}
                                         transitionAppearTimeout={900}
                                         transitionEnterTimeout={500}
                                         transitionLeaveTimeout={300}>
                    <ul className="collection">
                        {Comments}
                    </ul>
                </ReactCSSTransitionGroup>
            );
        } else {
            return null;
        }
    }
});

module.exports = CommentList;
