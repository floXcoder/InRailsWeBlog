'use strict';

import Input from '../../materialize/input';
import Select from '../../materialize/select';
import Submit from '../../materialize/submit';

export default class InlineEditTopic extends React.Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        topic: PropTypes.object,
        isEditing: PropTypes.bool
    };

    static defaultProps = {
        topic: {},
        isEditing: false
    };

    constructor(props) {
        super(props);

        this._topicName = null;
        this._topicVisibility = null;
    }

    _handleTopicSubmit = (event) => {
        event.preventDefault();

        this.props.onSubmit(this._topicName.value(), this._topicVisibility.value());
    };

    _handleTopicDelete = (event) => {
        event.preventDefault();

        this.props.onDelete(this.props.topic.id);
    };

    render() {
        return (
            <div className="topic-edit-content">
                <div className="topic-edit-center">
                    <h3 className="topic-edit-title">
                        {
                            this.props.isEditing
                                ?
                                I18n.t('js.topic.edit.title')
                                :
                                I18n.t('js.topic.new.title')
                        }
                    </h3>

                    <form id="topic_edit"
                          className="topic-form"
                          onSubmit={this._handleTopicSubmit}>
                        <Input ref={(topicInput) => this._topicName = topicInput}
                               id="topic_name"
                               hasAutoFocus={true}
                               placeholder={
                                   this.props.isEditing
                                       ?
                                       I18n.t('js.topic.edit.input')
                                       :
                                       I18n.t('js.topic.new.input')
                               }>
                            {this.props.isEditing ? this.props.topic.name : ''}
                        </Input>

                        <Select ref={(topicVisibility) => this._topicVisibility = topicVisibility}
                                id="topic_visibility"
                                className="margin-top-20"
                                title={I18n.t('js.topic.model.visibility')}
                                default={I18n.t('js.topic.common.visibility')}
                                options={I18n.t('js.topic.enums.visibility')}>
                            {this.props.isEditing ? this.props.topic.visibility : 'everyone'}
                        </Select>

                        <Submit id="topic-submit"
                                className="topic-button"
                                onClick={this._handleTopicSubmit}>
                            {
                                this.props.isEditing
                                    ?
                                    I18n.t('js.topic.edit.submit')
                                    :
                                    I18n.t('js.topic.new.submit')
                            }
                        </Submit>

                        {
                            this.props.isEditing &&
                            <div className="center-align margin-top-10">
                                <a className="topic-delete"
                                   href="#"
                                   onClick={this._handleTopicDelete}>
                                    {I18n.t('js.topic.edit.delete')}
                                </a>
                            </div>
                        }

                        <div className="center-align margin-top-10">
                            <a className="topic-cancel"
                               href="#"
                               onClick={this.props.onCancel}>
                                {I18n.t('js.topic.new.cancel')}
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
