'use strict';

// TODO
// import CommentActions from '../../../actions/commentActions';

import Input from '../../materialize/input';
import Textarea from '../../materialize/textarea';
import ShowMore from '../../theme/show-more';
import FixedActionButton from '../../materialize/fab';

import UserAvatarIcon from '../../users/icons/avatar';

export default class CommentInlineDisplay extends React.Component {
    static propTypes = {
        comment: PropTypes.object.isRequired,
        isInlineEditing: PropTypes.bool,
        onClick: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        editingField: undefined
    };

    componentDidMount() {
        $('#comment-actions').find('.tooltipped').tooltip();
    }

    componentDidUpdate() {
        $('#comment-actions').find('.tooltipped').tooltip();
    }

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

        $('#comment-actions').find('.fixed-action-btn').closeFAB();

        // TODO
        // CommentActions.deleteComment(this.props.comment.id, this.props.comment.commentable.id, {isPermanently: isPermanently === true});
    };

    _submitComment = (field, newValue, event) => {
        if (event) {
            event.preventDefault();
        }

        let commentToUpdate = {};

        if (field) {
            commentToUpdate[field] = newValue;
            $('#comment-actions').find('.tooltipped').tooltip('remove');
        } else if (this.refs[this.state.editingField]) {
            commentToUpdate[this.state.editingField] = this.refs[this.state.editingField].value();
        }

        if (!$.isEmpty(commentToUpdate)) {
            commentToUpdate.id = this.props.comment.id;
            // TODO
            // CommentActions.updateComment(commentToUpdate, this.props.comment.commentable.id, {url: this.props.comment.commentable.link});
        }
    };

    render() {
        return (
            <tr className="comment-inline">
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
                    {this.props.comment.posted_at}
                </td>

                <td>
                    <div id="comment-actions"
                         className="actions">
                        <FixedActionButton>
                            <div className="btn-floating tooltipped comment-link"
                                 data-tooltip={I18n.t('js.comment.table.actions.show')}>
                                <a href={this.props.comment.link}
                                   target="_blank">
                                    <span className="material-icons"
                                          data-icon="comment"
                                          aria-hidden="true"/>
                                </a>
                            </div>

                            <div className="btn-floating tooltipped comment-link"
                                 data-tooltip={I18n.t('js.comment.table.actions.delete')}>
                                <a href="#"
                                   onClick={this._deleteComment}
                                   data-confirm={I18n.t('js.comment.table.confirmation.delete', {comment: this.props.comment.name})}>
                                    <span className="material-icons"
                                          data-icon="delete"
                                          aria-hidden="true"/>
                                </a>
                            </div>

                            <div className="btn-floating tooltipped comment-link"
                                 data-tooltip={I18n.t('js.comment.table.actions.delete_permanently')}>
                                <a href="#"
                                   onClick={this._deleteComment.bind(this, true)}
                                   data-confirm={I18n.t('js.comment.table.confirmation.delete_permanently', {comment: this.props.comment.name})}>
                                    <span className="material-icons"
                                          data-icon="delete_forever"
                                          aria-hidden="true"/>
                                </a>
                            </div>

                            <div
                                className={'comment-link tooltipped btn-floating ' + (this.props.comment.accepted ? 'on' : 'off')}
                                data-tooltip={I18n.t('js.comment.table.actions.accepted')}>
                                <a href="#"
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

