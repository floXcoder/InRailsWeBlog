'use strict';

import Input from '../materialize/input';
import Textarea from '../materialize/textarea';
import Submit from '../materialize/submit';

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
        rating: 0,
        isAskingForDeletion: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        title: this.props.isAskingForDeletion ? I18n.t('js.comment.form.title.deletion_reply') : this.props.title,
        body: this.props.body,
        rating: this.props.rating
    };

    componentDidMount() {
        if (this.props.isAskingForDeletion) {
            this._body.focus();
        } else {
            this._title.focus();
        }
    }

    _handleFormChange = (name, value) => {
        this.setState({
            [name]: typeof value === 'string' ? value.trim() : value
        });
    };

    _handleSubmit = (event) => {
        event.preventDefault();

        if (!this.state.title || this.state.title.length < window.settings.comment_body_min_length || this.state.title.length > window.settings.comment_title_max_length) {
            return;
        }

        if (!this.state.body || this.state.body.length < window.settings.comment_comments_min_length || this.state.body.length > window.settings.comment_body_max_length) {
            return;
        }

        let submitData = {
            title: this.state.title,
            body: this.state.body,
            parent_id: this.props.parentCommentId,
            id: this.props.commentId
        };

        if (this.props.isRated && !this.props.isAskingForDeletion) {
            submitData.rating = this.state.rating;
        }

        if (this.props.isAskingForDeletion) {
            submitData.askForDeletion = true;
        }

        this.props.onSubmit(submitData);
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
                              acceptCharset="UTF-8"
                              noValidate="novalidate"
                              onSubmit={this._handleSubmit}>
                            <Input ref={(title) => this._title = title}
                                   id="comment-title"
                                   title={this.props.isAskingForDeletion ? I18n.t('js.comment.form.comment.title_for_deletion') : I18n.t('js.comment.form.comment.title')}
                                   autoComplete="off"
                                   minLength={window.settings.comment_title_min_length}
                                   maxLength={window.settings.comment_title_max_length}
                                   characterCount={window.settings.comment_title_max_length}
                                   onChange={this._handleFormChange.bind(this, 'title')}>
                                {this.props.title}
                            </Input>
                            {
                                this.state.title && (this.state.title.length < window.settings.comment_body_min_length || this.state.title.length > window.settings.comment_title_max_length) &&
                                <span className="comment-form-error">
                                    {
                                        I18n.t('js.comment.errors.title.size', {
                                            min: window.settings.comment_title_min_length,
                                            max: window.settings.comment_title_max_length
                                        })
                                    }
                                </span>
                            }

                            <Textarea ref={(body) => this._body = body}
                                      id="comment-body"
                                      className="margin-top-30"
                                      title={this.props.isAskingForDeletion ? I18n.t('js.comment.form.comment.body_for_deletion') : I18n.t('js.comment.form.comment.body')}
                                      isRequired={true}
                                      minLength={window.settings.comment_body_min_length}
                                      maxLength={window.settings.comment_body_max_length}
                                      characterCount={window.settings.comment_body_max_length}
                                      onChange={this._handleFormChange.bind(this, 'body')}>
                                {this.props.body}
                            </Textarea>
                            {
                                this.state.body && (this.state.body.length < window.settings.comment_body_min_length || this.state.body.length > window.settings.comment_body_max_length) &&
                                <span className="comment-form-error">
                                    {
                                        I18n.t('js.comment.errors.body.size', {
                                            min: window.settings.comment_body_min_length,
                                            max: window.settings.comment_body_max_length
                                        })
                                    }
                                </span>
                            }

                            {
                                this.props.isRated && !this.props.isAskingForDeletion &&
                                <div className="margin-top-20 margin-bottom-30">
                                    <Rating initialRating={this.props.rating}
                                            isReadOnly={false}
                                            hasInput={true}
                                            inputId="comment_rating"
                                            labelName={I18n.t('js.comment.form.comment.notation')}
                                            onChange={this._handleFormChange.bind(this, 'rating')}/>
                                </div>
                            }

                            <div className="row margin-top-10">
                                <div className="col s6">
                                    <a className="btn-flat waves-effect waves-light"
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

