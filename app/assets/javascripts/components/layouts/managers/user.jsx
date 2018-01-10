'use strict';

import {
    initUser,
    fetchTopics,
    fetchTags
} from '../../../actions';

@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    userCurrentId: state.userState.currentId,
    topicCurrentId: state.topicState.currentTopic && state.topicState.currentTopic.id
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
        userCurrentId: PropTypes.number,
        topicCurrentId: PropTypes.number,
        initUser: PropTypes.func,
        fetchTopics: PropTypes.func,
        fetchTags: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._router = null;

        // Load user environment if connected
        if (props.isUserConnected) {
            // Get current user details with current topic
            props.initUser(props.userCurrentId, {userProfile: true})
                .then((response) => {
                    if (response && response.user) {
                        // Get all user topics
                        props.fetchTopics(props.userCurrentId);

                        // Get all user tags for current topic (private user tags and common public tags associated to articles)
                        props.fetchTags({topicId: response.user.currentTopic.id});
                    }
                });
        } else {
            // Get all public tags (by default)
            props.fetchTags();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.topicCurrentId !== nextProps.topicCurrentId || (nextProps.routerState && nextProps.routerState.reloadTags)) {
            this.props.fetchTags({topicId: nextProps.topicCurrentId});
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
