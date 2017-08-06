'use strict';

import TopicActions from '../../actions/topicActions';
import TopicStore from '../../stores/topicStore';

import Input from '../materialize/input';
import Select from '../materialize/select';
import Submit from '../materialize/submit';

import {
    Link
} from 'react-router-dom';

export default class TopicModule extends Reflux.Component {
    static propTypes = {
        router: PropTypes.object.isRequired,
        onTopicClick: PropTypes.func
    };

    static defaultProps = {
        onTopicClick: null
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(TopicStore, this.onTopicChange);

        this._topicInput = null;
    }

    state = {
        currentTopicId: null,
        topics: [],
        isAddingTopic: false

        // TODO
        // topicEditingId: null,
        // isCreateTopicOpened: false,
    };

    componentWillMount() {
        if ($app.isUserConnected()) {
            this.setState({
                currentTopicId: $app.getCurrentTopic().id,
                topics: $app.user.topics
            });
        }
    }

    componentDidMount() {
    }

    onTopicChange(topicData) {
        if ($.isEmpty(topicData)) {
            return;
        }

        let newState = {};

        if (topicData.type === 'loadTopics') {
            newState.topics = topicData.topics;
        }

        // TODO
        // if (topicData.type === 'addTopic') {
        //     newState.topics = topicData.topics;
        // }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    _handleSwitchTopicClick = (topicId, topicSlug, event) => {
        event.preventDefault();

        if ($app.getCurrentTopic().id !== topicId) {
            TopicActions.switchTopic($app.user.currentId, topicId);
        }

        if (this.props.onTopicClick) {
            this.props.onTopicClick();
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
            TopicActions.addTopic($app.user.currentId, {
                name: this._topicInput.value()
            });

            if (this.props.onTopicClick) {
                this.props.onTopicClick();
            }
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
                        this.state.topics.map((topic) => (
                                <div key={topic.id}
                                     className="topic-item">
                                    <div className="topic-item-details"
                                         onClick={this._handleSwitchTopicClick.bind(this, topic.id, topic.slug)}>
                                        <a className={classNames({'topic-item-current': topic.id === this.state.currentTopicId})}>
                                            {topic.name}
                                        </a>
                                    </div>
                                </div>
                            )
                        )
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
