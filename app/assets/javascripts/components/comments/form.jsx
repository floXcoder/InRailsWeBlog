'use strict';

var Input = require('../../components/materialize/input');
var Textarea = require('../../components/materialize/textarea');
var Submit = require('../../components/materialize/submit');

var CommentForm = React.createClass({
    propTypes: {
        onSubmit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        parentCommentId: React.PropTypes.number,
        commentId: React.PropTypes.number,
        formTitle: React.PropTypes.string,
        title: React.PropTypes.string,
        message: React.PropTypes.string
    },

    getDefaultProps () {
        return {
            formTitle: I18n.t('js.comment.form.title.default'),
            parentCommentId: null,
            commentId: null,
            title: null,
            message: null
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

    _handleSubmit (event) {
        event.preventDefault();

        let title = this.refs.title.value().trim();
        let message = this.refs.message.value().trim();
        if (!title || !message) {
            return;
        }
        this.props.onSubmit({
            title: title,
            message: message,
            parentCommentId: this.props.parentCommentId,
            id: this.props.commentId
        });
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
