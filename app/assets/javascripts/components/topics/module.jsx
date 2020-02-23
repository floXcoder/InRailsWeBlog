'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

import {
    topicArticlesPath,
    newTopicParam
} from '../../constants/routesHelper';

import {
    showTopicPopup,
    spyTrackClick
} from '../../actions';

import styles from '../../../jss/topic/module';

export default @connect((state) => ({
    userSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    topics: state.topicState.userTopics
}), {
    showTopicPopup
})

@withStyles(styles)
class TopicModule extends React.Component {
    static propTypes = {
        onClose: PropTypes.func,
        // from connect
        userSlug: PropTypes.string,
        topics: PropTypes.array,
        currentUserTopicId: PropTypes.number,
        showTopicPopup: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        overTopicId: undefined
    };

    _handleSwitchTopicClick = (topicId) => {
        spyTrackClick('topic', topicId);

        this.props.showTopicPopup();
    };

    _handleOverEdit = (topicId) => {
        this.setState({
            overTopicId: topicId
        })
    };

    _renderTopicList = (topic) => {
        return (
            <div key={topic.id}
                 className={this.props.classes.list}
                 onMouseEnter={this._handleOverEdit.bind(this, topic.id)}
                 onMouseLeave={this._handleOverEdit.bind(this, null)}>
                <Link to={topicArticlesPath(this.props.userSlug, topic.slug)}
                      onClick={this._handleSwitchTopicClick.bind(this, topic.id)}>
                                    <span className={this.props.classes.item}>
                                        <span className={classNames(
                                            this.props.classes.itemContent, {
                                                [this.props.classes.currentItem]: topic.id === this.props.currentUserTopicId
                                            })}>
                                            {topic.name}
                                        </span>
                                    </span>
                </Link>

                {
                    this.state.overTopicId === topic.id &&
                    <Link className={this.props.classes.edition}
                          to={{
                              hash: '#' + newTopicParam,
                              state: {
                                  topicId: topic.id
                              }
                          }}>
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
            <div className={this.props.classes.module}>
                <div className={this.props.classes.title}>
                    {I18n.t('js.views.header.topic.title')}
                </div>

                <div className={this.props.classes.close}>
                    <IconButton aria-expanded={true}
                                aria-label="Close"
                                onClick={this.props.onClose}>
                        <CloseIcon color="primary"
                                   fontSize="large"/>
                    </IconButton>
                </div>

                {
                    privateTopics.map(this._renderTopicList)
                }

                <hr/>

                {
                    publicTopics.map(this._renderTopicList)
                }

                <div className={this.props.classes.addTopic}>
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
