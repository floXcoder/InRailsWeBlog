'use strict';

import {
    initUser,
    fetchTopics,
    fetchTags
} from '../../../actions';

@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    currentTopicId: state.topicState.currentTopic && state.topicState.currentTopic.id
}), {
    initUser,
    fetchTopics,
    fetchTags
})
export default class UserManager extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        routerState: PropTypes.object,
        // From connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        currentTopicId: PropTypes.number,
        initUser: PropTypes.func,
        fetchTopics: PropTypes.func,
        fetchTags: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Called each time a route changed!

        log.info('called !')

        // Load user environment if connected
        if (this.props.isUserConnected) {
            // Get current user details with current topic
            this.props.initUser(this.props.currentUserId, {userProfile: true})
                .fetch.then((response) => {
                if (response && response.user) {
                    // Get all user topics
                    this.props.fetchTopics(this.props.currentUserId);

                    // Loaded when current topic is updated
                    // Get all user tags for current topic (user private and common public tags associated to his articles)
                    // props.fetchTags({topicId: response.user.currentTopic.id});
                }

                if (this.props.currentTopicId && this.props.routerState && this.props.routerState.reloadTags) {
                    this.props.fetchTags({topicId: this.props.currentTopicId});
                }
            });
        } else {
            // Get only all public tags (by default)
            this.props.fetchTags();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentTopicId !== prevProps.currentTopicId || (prevProps.routerState && prevProps.routerState.reloadTags)) {
            this.props.fetchTags({topicId: prevProps.currentTopicId});
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
