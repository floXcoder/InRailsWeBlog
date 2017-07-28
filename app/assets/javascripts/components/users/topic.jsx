'use strict';

import TopicActions from '../../actions/topicActions';
import TopicStore from '../../stores/topicStore';

import Input from '../materialize/input';
import Select from '../materialize/select';
import Submit from '../materialize/submit';

import {
    Link
} from 'react-router-dom';

export default class UserTopic extends Reflux.Component {
    static propTypes = {
        router: React.PropTypes.object.isRequired,
        onTopicClick: React.PropTypes.func
    };

    static defaultProps = {
        onTopicClick: null
    };

    state = {
        currentTopicId: null,
        topics: [],
        isAddingTopic: false

        // TODO
        // topicEditingId: null,
        // isCreateTopicOpened: false,
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(TopicStore, this.onTopicChange);

        this._topicInput = null;
    }

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

        // TODO: edit
        // if ($app.getCurrentTopic().id !== topicId) {
        //     TopicActions.updateTopic($app.user.currentId, topicId);
        // }
    };

    render() {
        const {topics} = this.state;

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
                    Vos thèmes
                </div>

                <div className="topics-list">
                    {
                        topics.map((topic) =>
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
                    }
                </div>

                <div className="topics-add"
                     onClick={this._handleAddTopicClick}>
                    <a>
                        Ajouter un nouveau thème
                    </a>
                </div>
            </div>
        );
    }
}

// TODO
{/*<List>*/
}
{/*<Subheader>*/
}
{/*{I18n.t('js.topic.common.user_topics')}*/
}
{/*</Subheader>*/
}

{/*{*/
}
{/*this.state.topics.map((topic, i) =>*/
}
{/*<ListItem key={i}*/
}
{/*className={classNames('topic-list-item', {'topic-list-current': topic.id === this.state.currentTopic.id})}*/
}
{/*primaryText={topic.name}*/
}
{/*secondaryText={topic.description}*/
}
{/*onTouchTap={this._handleTopicClick.bind(this, topic.slug)}/>*/
}
{/*)*/
}
{/*}*/
}
{/*</List>*/
}

{/*<Divider />*/
}

{/*<List>*/
}
{/*<ListItem primaryText={I18n.t('js.topic.new.title')}*/
}
{/*leftIcon={<FontIcon className="material-icons">add_circle</FontIcon>}*/
}
{/*onTouchTap={this._handleShowCreateTopicClick}/>*/
}
{/*{*/
}
{/*this.state.isCreateTopicOpened &&*/
}
{/*<form className="topic-new"*/
}
{/*onSubmit={this._handleCreateTopicClick}>*/
}
{/*<Input ref={(topicInput) => this._topicInput = topicInput}*/
}
{/*id="topic-new-input"*/
}
{/*autoFocus={true}*/
}
{/*title={I18n.t('js.topic.new.input')}/>*/
}
{/*<Submit id="topic-new-submit"*/
}
{/*onClick={this._handleCreateTopicClick}>*/
}
{/*{I18n.t('js.topic.new.button')}*/
}
{/*</Submit>*/
}
{/*</form>*/
}
{/*}*/
}
{/*</List>*/
}


{/*<div className="topic-item-edit"*/
}
{/*onClick={this._handleEditTopicClick.bind(this, topic.id)}>*/
}
{/*<i className="material-icons">edit</i>*/
}
{/*</div>*/
}
