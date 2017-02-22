'use strict';

const CommentActions = require('../../../actions/commentActions');

const Input = require('../../materialize/input');
const Textarea = require('../../materialize/textarea');
const ShowMore = require('../../theme/show-more');
const FixedActionButton = require('../../materialize/fab');
const Slider = require('../../../components/theme/slider');

const UserAvatarIcon = require('../../users/icons/avatar');

var CommentInlineDisplay = React.createClass({
    propTypes: {
        comment: React.PropTypes.object.isRequired,
        isInlineEditing: React.PropTypes.bool,
        onClick: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            isInlineEditing: null,
            onClick: null
        };
    },

    getInitialState () {
        return {
            editingField: null
        };
    },

    componentDidMount () {
        $(ReactDOM.findDOMNode(this.refs.commentActions)).find('.tooltipped').tooltip();
    },

    componentDidUpdate () {
        $(ReactDOM.findDOMNode(this.refs.commentActions)).find('.tooltipped').tooltip();
    },

    _handleFieldEdit (fieldType, editingField, event) {
        event.preventDefault();

        // If already editing save field
        if (this.state.editingField) {
            this._submitComment();
            this.setState({
                editingField: null
            });
        } else {
            this.setState({
                editingField: editingField
            }, () => {
                if (fieldType === 'textarea') {
                    this.refs[editingField].focus();
                    this.refs[editingField].autoResize();
                } else if (fieldType === 'input') {
                    this.refs[editingField].focus();
                }
            });
        }
    },

    _handleKeyDown (event) {
        if (event.keyCode === 13) {
            this._submitComment();
            // Enter to save
            this.setState({
                editingField: null
            });
        } else if (event.keyCode === 27) {
            // ESC to cancel
            this.setState({
                editingField: null
            });
        }
    },

    _deleteComment (isPermanently, event) {
        if (event) {
            event.preventDefault();
        }

        $(ReactDOM.findDOMNode(this.refs.commentActions)).find('.fixed-action-btn').closeFAB();

        CommentActions.deleteComment(this.props.comment.id, this.props.comment.commentable.id, {isPermanently: isPermanently === true});
    },

    _submitComment (field, newValue, event) {
        if (event) {
            event.preventDefault();
        }

        let commentToUpdate = {};

        if (field) {
            commentToUpdate[field] = newValue;
            $(ReactDOM.findDOMNode(this.refs.commentActions)).find('.tooltipped').tooltip('remove');
        } else if (this.refs[this.state.editingField]) {
            commentToUpdate[this.state.editingField] = this.refs[this.state.editingField].value();
        }

        if (!$.isEmpty(commentToUpdate)) {
            commentToUpdate.id = this.props.comment.id;
            CommentActions.updateComment(commentToUpdate, this.props.comment.commentable.id, {url: this.props.comment.commentable.link});
        }
    },

    render () {
        return (
            <tr ref="commentInline"
                className="comment-inline">
                <td>
                    {this.props.comment.commentable_type}
                </td>
                <td>
                    <UserAvatarIcon user={this.props.comment.user}/>
                </td>
                <td onDoubleClick={this._handleFieldEdit.bind(this, 'input', 'title')}>
                    {
                        this.state.editingField === 'title'
                            ?
                            <div className="editing-field">
                                <Input ref="title"
                                       id="comment_title"
                                       multipleId={this.props.comment.id}
                                       onKeyDown={this._handleKeyDown}>
                                    {this.props.comment.title}
                                </Input>
                            </div>
                            :
                            this.props.comment.title
                    }
                </td>
                <td onDoubleClick={this._handleFieldEdit.bind(this, 'textarea', 'body')}>
                    {
                        this.state.editingField === 'body'
                            ?
                            <div className="editing-field">
                                <Textarea ref="body"
                                          id="comment_body"
                                          multipleId={this.props.comment.id}
                                          onKeyDown={this._handleKeyDown}>
                                    {this.props.comment.body}
                                </Textarea>
                            </div>
                            :
                            <ShowMore id={`show-more-${this.props.comment.id}`}>
                                {this.props.comment.body}
                            </ShowMore>
                    }
                </td>
                <td>
                    {this.props.comment.posted_at}
                </td>

                <td>
                    <div ref="commentActions"
                         className="actions">
                        <FixedActionButton>
                            <div className="comment-link tooltipped btn-floating"
                                 data-tooltip={I18n.t('js.comment.table.actions.show')}>
                                <a href={this.props.comment.link}>
                                    <i className="material-icons">comment</i>
                                </a>
                            </div>

                            <div className="comment-link tooltipped btn-floating"
                                 data-tooltip={I18n.t('js.comment.table.actions.delete')}>
                                <a href="#"
                                   onClick={this._deleteComment}
                                   data-confirm={I18n.t('js.comment.table.confirmation.delete', {comment: this.props.comment.name})}>
                                    <i className="material-icons">delete</i>
                                </a>
                            </div>

                            <div className="comment-link tooltipped btn-floating"
                                 data-tooltip={I18n.t('js.comment.table.actions.delete_permanently')}>
                                <a href="#"
                                   onClick={this._deleteComment.bind(this, true)}
                                   data-confirm={I18n.t('js.comment.table.confirmation.delete_permanently', {comment: this.props.comment.name})}>
                                    <i className="material-icons">delete_forever</i>
                                </a>
                            </div>

                            <div
                                className={'comment-link tooltipped btn-floating ' + (this.props.comment.accepted ? 'on' : 'off')}
                                data-tooltip={I18n.t('js.comment.table.actions.accepted')}>
                                <a href="#"
                                   onClick={this._submitComment.bind(this, 'accepted', !this.props.comment.accepted)}>
                                    <i className="material-icons">done</i>
                                </a>
                            </div>
                        </FixedActionButton>
                    </div>
                </td>
            </tr>
        );
    }
});

module.exports = CommentInlineDisplay;
