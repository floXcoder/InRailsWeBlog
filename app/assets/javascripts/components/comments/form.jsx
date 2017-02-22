'use strict';

const Input = require('../../components/materialize/input');
const Textarea = require('../../components/materialize/textarea');
const Submit = require('../../components/materialize/submit');
const Rating = require('../theme/rating');

require('../../modules/validation');

var CommentForm = React.createClass({
    propTypes: {
        onSubmit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        isRated: React.PropTypes.bool.isRequired,
        parentCommentId: React.PropTypes.number,
        commentId: React.PropTypes.number,
        formTitle: React.PropTypes.string,
        title: React.PropTypes.string,
        body: React.PropTypes.string,
        rating: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            formTitle: I18n.t('js.comment.form.title.default'),
            parentCommentId: null,
            commentId: null,
            title: null,
            body: null,
            rating: 0
        };
    },

    componentDidMount () {
        if (this.props.title) {
            this.refs.title.setValue(this.props.title);
        }
        if (this.props.body) {
            this.refs.body.setValue(this.props.body);
        }

        this.refs.title.focus();
    },

    _handleSubmit (event) {
        event.preventDefault();

        let validator = $(ReactDOM.findDOMNode(this.refs.commentForm)).parsley();
        if (!validator.isValid()) {
            validator.validate();
            return;
        }

        let title = this.refs.title.value().trim();
        let body = this.refs.body.value().trim();

        if (!title || !body) {
            return;
        }

        let submitData = {};

        if (this.props.isRated) {
            let rating = this.refs.commentRating.value();
            submitData = {
                title: title,
                body: body,
                rating: rating,
                parent_id: this.props.parentCommentId,
                id: this.props.commentId
            };

            this.refs.commentRating.setValue(0);
        } else {
            submitData = {
                title: title,
                body: body,
                parent_id: this.props.parentCommentId,
                id: this.props.commentId
            };
        }

        this.props.onSubmit(submitData);

        this.refs.title.setValue('');
        this.refs.body.setValue('');
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

                        <form ref="commentForm"
                              className="comment-form"
                              data-parsley-validate={true}
                              onSubmit={this._handleSubmit}>
                            <Input ref="title"
                                   id="comment-title"
                                   title={I18n.t('js.comment.form.comment.title')}
                                   autoComplete="off"
                                   characterCount={window.parameters.comment_title_max_length}
                                   validator={{
                                       'data-parsley-required': true,
                                       'data-parsley-minlength': window.parameters.comment_title_min_length,
                                       'data-parsley-maxlength': window.parameters.comment_title_max_length
                                   }}/>

                            <Textarea ref="body"
                                      id="comment-body"
                                      title={I18n.t('js.comment.form.comment.body')}
                                      characterCount={window.parameters.comment_body_max_length}
                                      validator={{
                                          'data-parsley-required': true,
                                          'data-parsley-minlength': window.parameters.comment_body_min_length,
                                          'data-parsley-maxlength': window.parameters.comment_body_max_length
                                      }}/>

                            {
                                this.props.isRated &&
                                <div className="margin-top-20 margin-bottom-30">
                                    <Rating ref="commentRating"
                                            initialRating={this.props.rating}
                                            isReadOnly={false}
                                            hasInput={true}
                                            inputId="comment_rating"
                                            labelName={I18n.t('js.comment.form.comment.notation')}/>
                                </div>
                            }

                            <div className="row margin-top-10">
                                <div className="col s6">
                                    <a className="btn-flat waves-effect waves-teal"
                                       onClick={this.props.onCancel}>
                                        {I18n.t('js.user.login.cancel')}
                                    </a>
                                </div>

                                <div className="col s6 right-align">
                                    <Submit id="comment-submit"
                                            onClick={this._handleSubmit}>
                                        {I18n.t('js.comment.form.submit')}
                                    </Submit>
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
