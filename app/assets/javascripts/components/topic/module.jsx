'use strict';

import {
    addTopic,
    updateTopic,
    deleteTopic,
    switchTopic,
    switchTopicPopup,
    spyTrackClick
} from '../../actions';

import {
    getTopics
} from '../../selectors';

import InlineEditTopic from './display/inlineEdit';

export default @connect((state) => ({
    userId: state.userState.currentId,
    userSlug: state.userState.currentSlug,
    isLoading: state.topicState.isFetching,
    currentTopic: state.topicState.currentTopic,
    topics: getTopics(state)
}), {
    addTopic,
    updateTopic,
    deleteTopic,
    switchTopic,
    switchTopicPopup
})
class TopicModule extends React.Component {
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
        deleteTopic: PropTypes.func,
        switchTopic: PropTypes.func,
        switchTopicPopup: PropTypes.func
    };

    constructor(props) {
        super(props);
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

    _handleCancel = (event) => {
        event.preventDefault();

        this.setState({
            isMutatingTopic: false,
            overTopicId: undefined,
            topicEditing: undefined
        });
    };

    _handleTopicSubmit = (topicName, topicVisibility) => {
        if (this.state.isMutatingTopic && topicName) {
            if (this.state.topicEditing) {
                this.props.updateTopic(this.props.userId, {
                    id: this.state.topicEditing.id,
                    name: topicName,
                    visibility: topicVisibility
                })
                    .then((response) => {
                        if (response.topic) {
                            return this.props.history.push(`/user/${this.props.userSlug}/${response.topic.slug}`);
                        }
                    })
                    .then(() => this.setState({isMutatingTopic: false}))
                    .then(() => this.props.switchTopicPopup());
            } else {
                this.props.addTopic(this.props.userId, {
                    name: topicName,
                    visibility: topicVisibility
                })
                    .then((response) => {
                        if (response.topic) {
                            return this.props.history.push(`/user/${this.props.userSlug}/${response.topic.slug}`);
                        }
                    })
                    .then(() => this.setState({isMutatingTopic: false}))
                    .then(() => this.props.switchTopicPopup());
            }
        }
    };

    _handleTopicDelete = (topicId) => {
        this.props.deleteTopic(this.props.userId, topicId)
            .then(() => this.setState({isMutatingTopic: false}))
            .then(() => this.props.switchTopicPopup());
    };

    render() {
        return (
            <div className={classNames('topics-sidebar', {
                'topic-sidebar-overhead': this.state.isMutatingTopic
            })}>
                <div className={classNames('topic-overhead', {
                    'topic-overhead-active': this.state.isMutatingTopic
                })}>
                    <InlineEditTopic key={Utils.uuid()}
                                     topic={this.state.topicEditing}
                                     isEditing={!!this.state.topicEditing}
                                     onCancel={this._handleCancel}
                                     onSubmit={this._handleTopicSubmit}
                                     onDelete={this._handleTopicDelete}/>
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
