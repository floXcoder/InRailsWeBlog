'use strict';

import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';

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
        rating: 0,
        isAskingForDeletion: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        title: (this.props.isAskingForDeletion ? I18n.t('js.comment.form.title.deletion_reply') : this.props.title) || '',
        body: this.props.body || '',
        rating: this.props.rating
    };

    _handleFormChange = (name, event) => {
        this.setState({
            [name]: event.target ? event.target.value : event
        });
    };

    _handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.title && (this.state.title.length < window.settings.comment_title_min_length || this.state.title.length > window.settings.comment_title_max_length)) {
            return;
        }

        if (!this.state.body || this.state.body.length < window.settings.comment_body_min_length || this.state.body.length > window.settings.comment_body_max_length) {
            return;
        }

        const submitData = {
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
            <div className="row comment-form">
                <div className="col s12">
                    <div className={classNames({'comment-form-owner': this.props.isOwner})}>
                        <div className="card-title comment-form-title">
                            {this.props.formTitle || I18n.t('js.comment.form.title.default')}
                        </div>

                        <form id="comment-form"
                              acceptCharset="UTF-8"
                              noValidate="novalidate"
                              onSubmit={this._handleSubmit}>
                            <TextField fullWidth={true}
                                       autoFocus={true}
                                       autoComplete="off"
                                       label={this.props.isAskingForDeletion
                                           ?
                                           I18n.t('js.comment.form.comment.title_for_deletion')
                                           :
                                           I18n.t('js.comment.form.comment.title')}
                                       variant="outlined"
                                       value={this.state.title}
                                       onChange={this._handleFormChange.bind(this, 'title')}/>
                            {
                                !!(this.state.title && (this.state.title.length < window.settings.comment_title_min_length || this.state.title.length > window.settings.comment_title_max_length)) &&
                                <FormHelperText id="component-error-text"
                                                className="comment-form-error">
                                    {
                                        I18n.t('js.comment.errors.title.size', {
                                            min: window.settings.comment_title_min_length,
                                            max: window.settings.comment_title_max_length
                                        })
                                    }
                                </FormHelperText>
                            }

                            <TextField multiline={true}
                                       className="margin-top-30"
                                       fullWidth={true}
                                       required={true}
                                       minRows={3}
                                       maxRows={4}
                                       autoComplete="off"
                                       label={this.props.isAskingForDeletion
                                           ?
                                           I18n.t('js.comment.form.comment.body_for_deletion')
                                           :
                                           I18n.t('js.comment.form.comment.body')}
                                       variant="outlined"
                                       value={this.state.body}
                                       onChange={this._handleFormChange.bind(this, 'body')}/>

                            {
                                !!(this.state.body && (this.state.body.length < window.settings.comment_body_min_length || this.state.body.length > window.settings.comment_body_max_length)) &&
                                <FormHelperText id="component-error-text"
                                                className="comment-form-error">
                                    {
                                        I18n.t('js.comment.errors.body.size', {
                                            min: window.settings.comment_body_min_length,
                                            max: window.settings.comment_body_max_length
                                        })
                                    }
                                </FormHelperText>
                            }

                            <span className="comment-form-explanation hide-on-small">
                                {I18n.t('js.comment.form.explanation')}
                                <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">
                                    {I18n.t('js.comment.form.syntax')}
                                </a>
                            </span>

                            {
                                !!(this.props.isRated && !this.props.isAskingForDeletion) &&
                                <div className="margin-top-20 margin-bottom-30">
                                    <Rating initialRating={this.props.rating}
                                            isReadOnly={false}
                                            hasInput={true}
                                            inputId="comment-rating"
                                            labelName={I18n.t('js.comment.form.comment.notation')}
                                            onChange={this._handleFormChange.bind(this, 'rating')}/>
                                </div>
                            }

                            <div className="row margin-top-25">
                                <div className="col s6">
                                    <Button variant="outlined" size="small" onClick={this.props.onCancel}>
                                        {I18n.t('js.comment.form.cancel')}
                                    </Button>
                                </div>

                                <div className="col s6 right-align">
                                    <Button color="primary"
                                            variant="contained"
                                            size="small"
                                            onClick={this._handleSubmit}>
                                        {I18n.t('js.comment.form.submit')}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

