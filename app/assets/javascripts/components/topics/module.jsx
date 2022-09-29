'use strict';

import {
    Link
} from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

import {
    topicArticlesPath,
    newTopicParam
} from '../../constants/routesHelper';

import {
    showTopicPopup,
    spyTrackClick
} from '../../actions';


export default @connect((state) => ({
    userSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    topics: state.topicState.userTopics
}), {
    showTopicPopup
})
class TopicModule extends React.Component {
    static propTypes = {
        onClose: PropTypes.func,
        // from connect
        userSlug: PropTypes.string,
        topics: PropTypes.array,
        currentUserTopicId: PropTypes.number,
        showTopicPopup: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        overTopicId: undefined
    };

    _handleSwitchTopicClick = (topicId, topicSlug, topicUserId, topicName) => {
        spyTrackClick('topic', topicId, topicSlug, topicUserId, topicName, null);

        this.props.showTopicPopup();
    };

    _handleOverEdit = (topicId) => {
        this.setState({
            overTopicId: topicId
        });
    };

    _renderTopicList = (topic) => {
        return (
            <div key={topic.id}
                 className="topic-module-list"
                 onMouseEnter={this._handleOverEdit.bind(this, topic.id)}
                 onMouseLeave={this._handleOverEdit.bind(this, null)}>
                <Link to={topicArticlesPath(this.props.userSlug, topic.slug)}
                      onClick={this._handleSwitchTopicClick.bind(this, topic.id, topic.slug, topic.userId, topic.name)}>
                                    <span className="topic-module-item">
                                        <span className={classNames('topic-module-item-content', {
                                            'topic-module-current-item': topic.id === this.props.currentUserTopicId
                                        })}>
                                            {topic.name}
                                        </span>
                                    </span>
                </Link>

                {
                    this.state.overTopicId === topic.id &&
                    <Link className="topic-module-edition"
                          to={{
                              hash: '#' + newTopicParam
                          }}
                          state={{topicId: topic.id}}>
                        <EditIcon/>
                    </Link>
                }
            </div>
        );
    };

    render() {
        const privateTopics = this.props.topics.filter((topic) => topic.visibility === 'only_me');
        const publicTopics = this.props.topics.filter((topic) => topic.visibility !== 'only_me');

        return (
            <div className="topic-module-module">
                <div className="topic-module-title">
                    {I18n.t('js.views.header.topic.title')}
                </div>

                <div className="topic-module-close">
                    <IconButton
                        aria-expanded={true}
                        aria-label="Close"
                        onClick={this.props.onClose}
                        size="large">
                        <CloseIcon color="primary"
                                   fontSize="large"/>
                    </IconButton>
                </div>

                {
                    privateTopics.map(this._renderTopicList)
                }

                <Divider/>

                {
                    publicTopics.map(this._renderTopicList)
                }

                <div className="topic-module-add-topic">
                    <Link to={{
                        hash: '#' + newTopicParam
                    }}
                          onClick={this.props.showTopicPopup}>
                        {I18n.t('js.views.header.topic.add')}
                    </Link>
                </div>
            </div>
        );
    }
}
