'use strict';

import {
    addTopic,
    updateTopic,
    switchTopic,
    switchTopicPopup,
    spyTrackClick
} from '../../actions';

import {
    getTopics
} from '../../selectors';

import Input from '../materialize/input';
import Select from '../materialize/select';
import Submit from '../materialize/submit';

@connect((state) => ({
    userId: state.userState.currentId,
    userSlug: state.userState.currentSlug,
    isLoading: state.topicState.isFetching,
    currentTopic: state.topicState.currentTopic,
    topics: getTopics(state)
}), {
    addTopic,
    updateTopic,
    switchTopic,
    switchTopicPopup
})
export default class TopicModule extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        // From connect
        userId: PropTypes.number,
        userSlug: PropTypes.string,
        isLoading: PropTypes.bool,
        topics: PropTypes.array,
        currentTopic: PropTypes.object,
        addTopic: PropTypes.func,
        updateTopic: PropTypes.func,
        switchTopic: PropTypes.func,
        switchTopicPopup: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._topicName = null;
        this._topicVisibility = null;
    }

    state = {
        isMutatingTopic: false,
        overTopicId: undefined,
        topicEditing: undefined
    };

    _handleSwitchTopicClick = (newTopicId, event) => {
        event.preventDefault();

        // Return if click on edit icon
        if (event.target.className === 'material-icons') {
            return;
        }

        spyTrackClick('topic', newTopicId);

        if (this.props.currentTopic.id !== newTopicId) {
            this.props.switchTopic(this.props.userId, newTopicId)
                .fetch
                .then((response) => {
                    if (response.topic) {
                        return this.props.history.push(`/user/${this.props.userSlug}/${response.topic.slug}`);
                    }
                })
                .then(() => this.props.switchTopicPopup());
        }
    };

    _handleAddTopicClick = (event) => {
        event.preventDefault();

        ReactDOM.findDOMNode(this).scrollTo(0, 0);

        if (this._topicName) {
            this._topicName.focus();
        }

        this.setState({
            isMutatingTopic: true
        });
    };

    _handleOverEdit = (topicId) => {
        this.setState({
            overTopicId: topicId
        })
    };

    _handleTopicEdit = (topic, event) => {
        event.preventDefault();

        ReactDOM.findDOMNode(this).scrollTo(0, 0);

        this.setState({
            isMutatingTopic: true,
            topicEditing: topic
        });
    };

    _handleTopicSubmit = (event) => {
        event.preventDefault();

        if (this.state.isMutatingTopic && this._topicName) {
            if (this.state.topicEditing) {
                this.props.updateTopic(this.props.userId, {
                    id: this.state.topicEditing.id,
                    name: this._topicName.value(),
                    visibility: this._topicVisibility.value()
                })
                    .then((response) => {
                        if (response.topic) {
                            return this.props.history.push(`/user/${this.props.userSlug}/${response.topic.slug}`);
                        }
                    })
                    .then(() => this.props.switchTopicPopup());
            } else {
                this.props.addTopic(this.props.userId, {
                    name: this._topicName.value(),
                    visibility: this._topicVisibility.value()
                })
                    .then((response) => {
                        if (response.topic) {
                            return this.props.history.push(`/user/${this.props.userSlug}/${response.topic.slug}`);
                        }
                    })
                    .then(() => this.props.switchTopicPopup());
            }
        }
    };

    render() {
        return (
            <div className={classNames('topics-sidebar', {
                'topic-sidebar-overhead': this.state.isMutatingTopic
            })}>
                <div className={classNames('topic-overhead', {
                    'topic-overhead-active': this.state.isMutatingTopic
                })}>
                    <div className="topic-edit-content">
                        <div className="topic-edit-center">
                            <h3 className="topic-edit-title">
                                {
                                    this.state.topicEditing
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
                                       placeholder={
                                           this.state.topicEditing
                                               ?
                                               I18n.t('js.topic.edit.input')
                                               :
                                               I18n.t('js.topic.new.input')
                                       }>
                                    {this.state.topicEditing && this.state.topicEditing.name}
                                </Input>

                                <Select ref={(topicVisibility) => this._topicVisibility = topicVisibility}
                                        id="topic_visibility"
                                        className="margin-top-15"
                                        title={I18n.t('js.topic.model.visibility')}
                                        default={I18n.t('js.topic.common.visibility')}
                                        options={I18n.t('js.topic.enums.visibility')}>
                                    {this.state.topicEditing ? this.state.topicEditing.visibility : 'everyone'}
                                </Select>

                                <Submit id="topic-submit"
                                        className="topic-button"
                                        onClick={this._handleTopicSubmit}>
                                    {
                                        this.state.topicEditing
                                            ?
                                            I18n.t('js.topic.edit.submit')
                                            :
                                            I18n.t('js.topic.new.submit')
                                    }
                                </Submit>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="topics-list-name">
                    {I18n.t('js.views.header.topic.title')}
                </div>

                <div className="topics-list">
                    {
                        this.props.topics.map((topic) => (
                            <a key={topic.id}
                               href={`/user/${this.props.userSlug}/${topic.slug}`}
                               onMouseEnter={this._handleOverEdit.bind(this, topic.id)}
                               onMouseLeave={this._handleOverEdit.bind(this, null)}
                               onClick={this._handleSwitchTopicClick.bind(this, topic.id)}>
                                <span className="topic-item">
                                    <span
                                        className={classNames('topic-item-details', {'topic-item-current': topic.id === this.props.currentTopic.id})}>
                                        {topic.name}
                                    </span>

                                    {
                                        this.state.overTopicId === topic.id &&
                                        <span className="topic-item-edit"
                                              onClick={this._handleTopicEdit.bind(this, topic)}>
                                            <span className="material-icons"
                                                  data-icon="edit"
                                                  aria-hidden="true"/>
                                        </span>
                                    }
                                </span>
                            </a>
                        ))
                    }
                </div>

                <div className="topics-add"
                     onClick={this._handleAddTopicClick}>
                    <a>
                        {I18n.t('js.views.header.topic.add')}
                    </a>
                </div>
            </div>
        );
    }
}
