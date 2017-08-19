'use strict';

import Input from '../../components/materialize/input';
import Textarea from '../../components/materialize/textarea';
import Submit from '../../components/materialize/submit';
import Rating from '../theme/rating';

export default class CommentForm extends React.PureComponent {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        isOwner: PropTypes.bool.isRequired,
        isRated: PropTypes.bool.isRequired,
        parentCommentId: PropTypes.number,
        commentId: PropTypes.number,
        formTitle: PropTypes.string,
        title: PropTypes.string,
        body: PropTypes.string,
        rating: PropTypes.number,
        isAskingForDeletion: PropTypes.bool
    };

    static defaultProps = {
        formTitle: I18n.t('js.comment.form.title.default'),
        parentCommentId: null,
        commentId: null,
        title: null,
        body: null,
        rating: 0,
        isAskingForDeletion: false
    };

    constructor(props) {
        super(props);

        this._title = null;
        this._body = null;
        this._commentRating = null;
    }

    componentDidMount() {
        if (this.props.title) {
            this._title.setValue(this.props.title);
        }
        if (this.props.body) {
            this._body.setValue(this.props.body);
        }

        if (this.props.isAskingForDeletion) {
            this._title.setValue(I18n.t('js.comment.form.title.deletion_reply'));
            this._body.focus();
        } else {
            this._title.focus();
        }
    }

    _handleSubmit = (event) => {
        event.preventDefault();

        let validator = $('#comment-form').parsley();
        if (!validator.isValid()) {
            validator.validate();
            return;
        }

        let title = this._title.value().trim();
        let body = this._body.value().trim();

        if (!title || !body) {
            return;
        }

        let submitData = {};

        if (this.props.isRated && !this.props.isAskingForDeletion) {
            let rating = this._commentRating.value();
            submitData = {
                title: title,
                body: body,
                rating: rating,
                parent_id: this.props.parentCommentId,
                id: this.props.commentId
            };

            this._commentRating.setValue(0);
        } else {
            submitData = {
                title: title,
                body: body,
                parent_id: this.props.parentCommentId,
                id: this.props.commentId
            };
        }

        if (this.props.isAskingForDeletion) {
            submitData.ask_for_deletion = true;
        }

        this.props.onSubmit(submitData);

        this._title.setValue('');
        this._body.setValue('');
    };

    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <div className={classNames('card-panel', {'comment-form-owner': this.props.isOwner})}>
                        <span className="card-title comment-form-title">
                            {this.props.formTitle}
                        </span>

                        <span className="comment-form-explanation hide-on-small-and-down">
                            {I18n.t('js.comment.form.explanation')}
                            <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">
                                {I18n.t('js.comment.form.syntax')}
                            </a>
                        </span>

                        <form id="comment-form"
                              className="comment-form"
                              data-parsley-validate={true}
                              onSubmit={this._handleSubmit}>
                            <Input ref={(title) => this._title = title}
                                   id="comment-title"
                                   title={this.props.isAskingForDeletion ? I18n.t('js.comment.form.comment.title_for_deletion') : I18n.t('js.comment.form.comment.title')}
                                   autoComplete="off"
                                   maxLength={window.settings.comment_title_max_length}
                                   characterCount={window.settings.comment_title_max_length}
                                   validator={{
                                       'data-parsley-required': true,
                                       'data-parsley-minlength': window.settings.comment_title_min_length,
                                       'data-parsley-maxlength': window.settings.comment_title_max_length
                                   }}/>

                            <Textarea ref={(body) => this._body = body}
                                      id="comment-body"
                                      title={this.props.isAskingForDeletion ? I18n.t('js.comment.form.comment.body_for_deletion') : I18n.t('js.comment.form.comment.body')}
                                      maxLength={window.settings.comment_body_max_length}
                                      characterCount={window.settings.comment_body_max_length}
                                      validator={{
                                          'data-parsley-required': true,
                                          'data-parsley-minlength': window.settings.comment_body_min_length,
                                          'data-parsley-maxlength': window.settings.comment_body_max_length
                                      }}/>

                            {
                                this.props.isRated && !this.props.isAskingForDeletion &&
                                <div className="margin-top-20 margin-bottom-30">
                                    <Rating ref={(commentRating) => this._commentRating = commentRating}
                                            initialRating={this.props.rating}
                                            isReadOnly={false}
                                            hasInput={true}
                                            inputId="comment_rating"
                                            labelName={I18n.t('js.comment.form.comment.notation')}/>
                                </div>
                            }

                            <div className="row margin-top-10">
                                <div className="col s6">
                                    <a className="waves-effect waves-spectra btn-flat"
                                       onClick={this.props.onCancel}>
                                        {I18n.t('js.comment.form.cancel')}
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
}

