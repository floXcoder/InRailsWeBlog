'use strict';

var Input = require('../../components/materialize/input');
var Textarea = require('../../components/materialize/textarea');
var Submit = require('../../components/materialize/submit');
var Rating = require('../theme/rating');

var CommentForm = React.createClass({
    propTypes: {
        onSubmit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        isRated: React.PropTypes.bool.isRequired,
        parentCommentId: React.PropTypes.number,
        commentId: React.PropTypes.number,
        formTitle: React.PropTypes.string,
        title: React.PropTypes.string,
        message: React.PropTypes.string,
        rating: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            formTitle: I18n.t('js.comment.form.title.default'),
            parentCommentId: null,
            commentId: null,
            title: null,
            message: null,
            rating: 0
        };
    },

    componentDidMount () {
        if (this.props.title) {
            this.refs.title.setValue(this.props.title);
        }
        if (this.props.message) {
            this.refs.message.setValue(this.props.message);
        }

        this.refs.title.focus();
    },

    _handleRatingChange (value) {
        this.refs.rating.value = value;
    },

    _handleSubmit (event) {
        event.preventDefault();

        let title = this.refs.title.value().trim();
        let message = this.refs.message.value().trim();

        if (!title || !message) {
            return;
        }

        let submitData = {};

        if(this.props.isRated) {
            let rating = this.refs.rating.value;
            submitData = {
                title: title,
                message: message,
                rating: rating,
                parentCommentId: this.props.parentCommentId,
                id: this.props.commentId
            };
            this.refs.rating.value = 0;
        } else {
            submitData = {
                title: title,
                message: message,
                parentCommentId: this.props.parentCommentId,
                id: this.props.commentId
            };
        }

        this.props.onSubmit(submitData);

        this.refs.title.setValue('');
        this.refs.message.setValue('');
    },

    render () {
        return (
            <div className="row">
                <div className="col s12">
                    <div className="card-panel">
                        <span className="card-title comment-form-title">
                            {this.props.formTitle}
                        </span>
                        <span className="comment-form-explanation hide-on-small-and-down">
                            {I18n.t('js.comment.form.explanation')}
                            <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">
                                {I18n.t('js.comment.form.syntax')}
                            </a>
                        </span>
                        <form className="comment-form"
                              onSubmit={this._handleSubmit}>
                            <Input ref="title"
                                   id="comment-title"
                                   autoComplete="off"
                                   characterCount={window.parameters.comment_title_max_length}>
                                {I18n.t('js.comment.form.comment.title')}
                            </Input>
                            <Textarea ref="message"
                                      id="comment-message"
                                      characterCount={window.parameters.comment_body_max_length}>
                                {I18n.t('js.comment.form.comment.message')}
                            </Textarea>

                            {this.props.isRated &&
                            <div className="margin-top-20 margin-bottom-30">
                                <label htmlFor="comment-rating">
                                    {I18n.t('js.comment.form.comment.notation')}
                                </label>
                                <Rating initialRating={this.props.rating}
                                        onChange={this._handleRatingChange}/>
                                <input ref="rating"
                                       id="comment-rating"
                                       type="hidden"/>
                            </div>}

                            <div className="row margin-top-10">
                                <div className="col s6">
                                    <Submit id="comment-submit">
                                        {I18n.t('js.comment.form.submit')}
                                    </Submit>
                                </div>
                                <div className="col s6 right-align">
                                    <a className="btn-flat waves-effect waves-teal"
                                       onClick={this.props.onCancel}>
                                        {I18n.t('js.user.login.cancel')}
                                    </a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = CommentForm;
