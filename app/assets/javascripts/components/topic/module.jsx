'use strict';

import {
    Link
} from 'react-router-dom';

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

        this._topicInput = null;
    }

    state = {
        isAddingTopic: false
    };

    _handleSwitchTopicClick = (newTopicId) => {
        spyTrackClick('topic', newTopicId);

        if (this.props.currentTopic.id !== newTopicId) {
            this.props.switchTopic(this.props.userId, newTopicId)
                .then(() => this.props.switchTopicPopup());
        }
    };

    _handleAddTopicClick = (event) => {
        event.preventDefault();

        ReactDOM.findDOMNode(this).scrollTo(0, 0);

        if (this._topicInput) {
            this._topicInput.focus();
        }

        this.setState({
            isAddingTopic: true
        });
    };

    _handleTopicSubmit = (event) => {
        event.preventDefault();

        if (this.state.isAddingTopic && this._topicInput) {
            this.props.addTopic({
                name: this._topicInput.value()
            });
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
                                <Input ref={(topicInput) => this._topicInput = topicInput}
                                       id="topic_name"
                                       placeholder={I18n.t('js.topic.new.input')}/>

                                <Select id="topic_visibility"
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
                            <Link key={topic.id}
                                  to={`/user/${this.props.userSlug}/${topic.slug}`}
                                  onClick={this._handleSwitchTopicClick.bind(this, topic.id)}>
                                <div className="topic-item">
                                    <div className={classNames('topic-item-details', {'topic-item-current': topic.id === this.props.currentTopic.id})}>
                                        {topic.name}
                                    </div>
                                </div>
                            </Link>
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
