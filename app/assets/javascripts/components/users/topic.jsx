'use strict';

import UserActions from '../../actions/userActions';
import UserStore from '../../stores/userStore';

import Input from '../materialize/input';
import Submit from '../materialize/submit';

import {Subheader, Divider, FontIcon} from 'material-ui';
import {List, ListItem} from 'material-ui/List';


export default class UserTopic extends Reflux.Component {
    static propTypes = {
        onClick: React.PropTypes.func
    };

    static childContextTypes = {
        router: React.PropTypes.object
    };

    static defaultProps = {
        onClick: true
    };

    state = {
        isCreateTopicOpened: false,
        topics: $app.user.isConnected() ? $app.user.topic.topics : [],
        currentTopic: $app.user.isConnected() ? $app.user.topic.current_topic : null
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(UserStore, this.onTopicChange);

        this._topicInput = null;
    }

    componentDidMount() {
    }

    onTopicChange(topicData) {
        if ($.isEmpty(topicData)) {
            return;
        }

        let newState = {};

        if (topicData.type === 'addTopic') {
            newState.topics = this.state.topics.concat(topicData.topic);
            $app.user.topic.topics = newState.topics;
        }

        if (topicData.type === 'addTopicError') {
            if (topicData.topicErrors.name) {
                Materialize.toast(topicData.topicErrors.name.first(), 3000);
            }
        }

        if (topicData.type === 'changeTopic') {
            newState.currentTopic = topicData.topic;
            $app.user.topic.current_topic = topicData.topic;
            this.context.router.push(`/article/user/${$app.user.current.slug}/topic/${topicData.topic.slug}`);
        }

        if (topicData.type === 'changeTopicError') {
            if (topicData.topicErrors.topic) {
                Materialize.toast(topicData.topicErrors.topic.first(), 3000);
            }
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    _handleTopicClick(topicSlug, event) {
        event.preventDefault();

        // if (this.state.currentTopic.slug !== topicSlug) {
        UserActions.changeTopic($app.user.currentId, topicSlug);
        // }
    }

    _handleShowCreateTopicClick(event) {
        event.preventDefault();

        this.setState({isCreateTopicOpened: true});
    }

    _handleCreateTopicClick() {
        this.setState({isCreateTopicOpened: false});

        if (this._topicInput) {
            UserActions.addTopic(
                $app.user.currentId,
                {
                    name: this._topicInput.value()
                });
        }
    }

    render() {
        return (
            <div className="topic-list">
                <List>
                    <Subheader>
                        {I18n.t('js.topic.common.user_topics')}
                    </Subheader>

                    {
                        this.state.topics.map((topic, i) =>
                            <ListItem key={i}
                                      className={classNames('topic-list-item', {'topic-list-current': topic.id === this.state.currentTopic.id})}
                                      primaryText={topic.name}
                                      secondaryText={topic.description}
                                      onTouchTap={this._handleTopicClick.bind(this, topic.slug)}/>
                        )
                    }
                </List>

                <Divider />

                <List>
                    <ListItem primaryText={I18n.t('js.topic.new.title')}
                              leftIcon={<FontIcon className="material-icons">add_circle</FontIcon>}
                              onTouchTap={this._handleShowCreateTopicClick}/>
                    {
                        this.state.isCreateTopicOpened &&
                        <form className="topic-new"
                              onSubmit={this._handleCreateTopicClick}>
                            <Input ref={(topicInput) => this._topicInput = topicInput}
                                   id="topic-new-input"
                                   autoFocus={true}
                                   title={I18n.t('js.topic.new.input')}/>
                            <Submit id="topic-new-submit"
                                    onClick={this._handleCreateTopicClick}>
                                {I18n.t('js.topic.new.button')}
                            </Submit>
                        </form>
                    }
                </List>
            </div>
        );
    }
}
