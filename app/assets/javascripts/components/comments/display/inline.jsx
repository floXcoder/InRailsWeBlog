'use strict';

import {
    updateComment,
    deleteComment
} from '../../../actions';

import Input from '../../materialize/input';
import Textarea from '../../materialize/textarea';
import ShowMore from '../../theme/showMore';
import FixedActionButton from '../../materialize/fab';

import UserAvatarIcon from '../../users/icons/avatar';

export default @connect(null, {
    updateComment,
    deleteComment
})
class CommentInlineDisplay extends React.Component {
    static propTypes = {
        comment: PropTypes.object.isRequired,
        isInlineEditing: PropTypes.bool,
        onClick: PropTypes.func,
        // From connect
        updateComment: PropTypes.func,
        deleteComment: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        editingField: undefined
    };

    _handleFieldEdit = (fieldType, editingField, event) => {
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
    };

    _handleKeyDown = (event) => {
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
    };

    _deleteComment = (isPermanently, event) => {
        if (event) {
            event.preventDefault();
        }

        this.props.deleteComment(this.props.comment.id, this.props.comment.commentable.id, {permanently: isPermanently === true});
    };

    _submitComment = (field, newValue, event) => {
        if (event) {
            event.preventDefault();
        }

        let commentToUpdate = {};

        if (field) {
            commentToUpdate[field] = newValue;
        } else if (this.refs[this.state.editingField]) {
            commentToUpdate[this.state.editingField] = this.refs[this.state.editingField].value();
        }

        if (!Utils.isEmpty(commentToUpdate)) {
            commentToUpdate.id = this.props.comment.id;
            this.props.updateComment(commentToUpdate, this.props.comment.commentableType, this.props.comment.commentable.id);
        }
    };

    render() {
        return (
            <tr className="comment-inline">
                <td>
                    {this.props.comment.commentableType}
                </td>
                <td>
                    <UserAvatarIcon user={this.props.comment.user}/>
                </td>
                <td onDoubleClick={this._handleFieldEdit.bind(this, 'input', 'title')}>
                    {
                        this.state.editingField === 'title'
                            ?
                            <div className="editing-field">
                                <Input id="comment_title"
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
                                <Textarea id="comment_body"
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
                    {this.props.comment.postedAt}
                </td>

                <td>
                    <div id="comment-actions"
                         className="actions">
                        <FixedActionButton>
                            <div className="comment-link tooltip-bottom"
                                 data-tooltip={I18n.t('js.comment.table.actions.show')}>
                                <a className="btn-floating"
                                   href={this.props.comment.link}
                                   target="_blank">
                                    <span className="material-icons"
                                          data-icon="comment"
                                          aria-hidden="true"/>
                                </a>
                            </div>

                            <div className="comment-link tooltip-bottom"
                                 data-tooltip={I18n.t('js.comment.table.actions.delete')}>
                                <a className="btn-floating"
                                   href="#"
                                   onClick={this._deleteComment}
                                   data-confirm={I18n.t('js.comment.table.confirmation.delete', {comment: this.props.comment.name})}>
                                    <span className="material-icons"
                                          data-icon="delete"
                                          aria-hidden="true"/>
                                </a>
                            </div>

                            <div className="comment-link tooltip-bottom"
                                 data-tooltip={I18n.t('js.comment.table.actions.delete_permanently')}>
                                <a className="btn-floating"
                                   href="#"
                                   onClick={this._deleteComment.bind(this, true)}
                                   data-confirm={I18n.t('js.comment.table.confirmation.delete_permanently', {comment: this.props.comment.name})}>
                                    <span className="material-icons"
                                          data-icon="delete_forever"
                                          aria-hidden="true"/>
                                </a>
                            </div>

                            <div className="comment-link tooltip-bottom"
                                 data-tooltip={I18n.t('js.comment.table.actions.accepted')}>
                                <a className={classNames('btn-floating', this.props.comment.accepted ? 'on' : 'off')}
                                   href="#"
                                   onClick={this._submitComment.bind(this, 'accepted', !this.props.comment.accepted)}>
                                    <span className="material-icons"
                                          data-icon="done"
                                          aria-hidden="true"/>
                                </a>
                            </div>
                        </FixedActionButton>
                    </div>
                </td>
            </tr>
        );
    }
}

