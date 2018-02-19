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

        // Called each time a route changed!

        // Load user environment if connected
        if (props.isUserConnected) {
            // Get current user details with current topic
            props.initUser(props.currentUserId, {userProfile: true})
                .then((response) => {
                    if (response && response.user) {
                        // Get all user topics
                        props.fetchTopics(props.currentUserId);

                        // Loaded when current topic is updated
                        // Get all user tags for current topic (user private and common public tags associated to his articles)
                        // props.fetchTags({topicId: response.user.currentTopic.id});
                    }

                    if (props.currentTopicId && props.routerState && props.routerState.reloadTags) {
                        props.fetchTags({topicId: props.currentTopicId});
                    }
                });
        } else {
            // Get only all public tags (by default)
            props.fetchTags();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.currentTopicId !== nextProps.currentTopicId || (nextProps.routerState && nextProps.routerState.reloadTags)) {
            this.props.fetchTags({topicId: nextProps.currentTopicId});
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
