'use strict';

var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var Button = require('../materialize/button');
var CommentList = require('../comments/list');
var CommentForm = require('../comments/form');

var CommentBox = React.createClass({
    propTypes: {
        comments: React.PropTypes.array.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        onSubmit: React.PropTypes.func.isRequired,
        isRated: React.PropTypes.bool,
        currentUserId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            currentUserId: null,
            isRated: true
        };
    },

    getInitialState () {
        return {
            showCommentForm: false
        };
    },

    _handleAddComment (event) {
        event.preventDefault();
        if (!this.props.currentUserId) {
            Materialize.toast(I18n.t('js.comment.flash.creation_unpermitted'), 5000);
        } else {
            this.setState({showCommentForm: true});
        }
    },

    _handleCommentCancel (event) {
        event.preventDefault();
        this.setState({showCommentForm: false});
    },

    _handleCommentSubmit (commentData) {
        this.setState({showCommentForm: false});
        this.props.onSubmit(commentData);
    },

    render () {
        return (
            <div className="blog-comments">
                <h3 className="blog-comments-title">
                    {I18n.t('js.comment.title')}
                </h3>

                <div className="blog-comments-box">
                    {this.props.comments.length === 0 &&
                    <h5 className="center-align">
                        {I18n.t('js.comment.empty')}
                    </h5>}

                    <CommentList comments={this.props.comments}
                                 isRated={this.props.isRated}
                                 currentUserId={this.props.currentUserId}
                                 onDelete={this.props.onDelete}
                                 onSubmit={this._handleCommentSubmit}/>
                    {!this.state.showCommentForm &&
                    <div className="center-align">
                        <Button icon="comment"
                                iconPosition="left"
                                onClickButton={this._handleAddComment}>
                            {I18n.t('js.comment.new.button')}
                        </Button>
                    </div>}
                    {this.state.showCommentForm &&
                    <ReactCSSTransitionGroup transitionName="comment-form"
                                             transitionAppear={true}
                                             transitionAppearTimeout={600}
                                             transitionEnterTimeout={500}
                                             transitionLeaveTimeout={300}>
                        <CommentForm refs="commentForm"
                                     isRated={this.props.isRated}
                                     onCancel={this._handleCommentCancel}
                                     onSubmit={this._handleCommentSubmit}/>
                    </ReactCSSTransitionGroup>}
                </div>
            </div>
        );
    }
});

module.exports = CommentBox;
