'use strict';

import {
    addTopic,
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
        switchTopic: PropTypes.func,
        switchTopicPopup: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._topicName = null;
        this._topicVisibility = null;
    }

    state = {
        isAddingTopic: false
    };

    _handleSwitchTopicClick = (newTopicId, event) => {
        event.preventDefault();

        spyTrackClick('topic', newTopicId);

        if (this.props.currentTopic.id !== newTopicId) {
            this.props.switchTopic(this.props.userId, newTopicId)
                .then((response) => this.props.history.push(`/user/${this.props.userSlug}/${response.topic.slug}`))
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
            isAddingTopic: true
        });
    };

    _handleTopicSubmit = (event) => {
        event.preventDefault();

        if (this.state.isAddingTopic && this._topicName) {
            this.props.addTopic(this.props.userId, {
                name: this._topicName.value(),
                visibility: this._topicVisibility.value()
            })
                .then((response) => this.props.history.push(`/user/${this.props.userSlug}/${response.topic.slug}`))
                .then(() => this.props.switchTopicPopup());
        }
    };

    render() {
        return (
            <div className={classNames('topics-sidebar', {'topic-sidebar-overhead': this.state.isAddingTopic})}>
                <div className={classNames('topic-overhead', {'topic-overhead-active': this.state.isAddingTopic})}>
                    <div className="topic-edit-content">
                        <div className="topic-edit-center">
                            <h3 className="topic-edit-title">
                                {I18n.t('js.topic.new.title')}
                            </h3>

                            <form id="topic_edit"
                                  className="topic-form"
                                  onSubmit={this._handleTopicSubmit}>
                                <Input ref={(topicInput) => this._topicName = topicInput}
                                       id="topic_name"
                                       placeholder={I18n.t('js.topic.new.input')}/>

                                <Select ref={(topicVisibility) => this._topicVisibility = topicVisibility}
                                        id="topic_visibility"
                                        className="margin-top-15"
                                        title={I18n.t('js.topic.model.visibility')}
                                        default={I18n.t('js.topic.common.visibility')}
                                        options={I18n.t('js.topic.enums.visibility')}>
                                    {'everyone'}
                                </Select>

                                <Submit id="topic-submit"
                                        className="topic-button"
                                        onClick={this._handleTopicSubmit}>
                                    {I18n.t('js.topic.new.submit')}
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
                               onClick={this._handleSwitchTopicClick.bind(this, topic.id)}>
                                <div className="topic-item">
                                    <div
                                        className={classNames('topic-item-details', {'topic-item-current': topic.id === this.props.currentTopic.id})}>
                                        {topic.name}
                                    </div>
                                </div>
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
