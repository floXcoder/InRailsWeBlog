'use strict';

import {
    initUser,
    fetchTopics,
    fetchTags,
    getTracksClick,
    fetchUserRecents,
    updateUserRecents,
    fetchBookmarks,
    synchronizeBookmarks,
    setCurrentTags
} from '../../../actions';

export default @connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    currentTopicId: state.topicState.currentTopicId
}), {
    initUser,
    fetchTopics,
    fetchTags,
    fetchUserRecents,
    updateUserRecents,
    fetchBookmarks,
    synchronizeBookmarks,
    setCurrentTags
})
class UserManager extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        routerState: PropTypes.object,
        // From connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        currentTopicId: PropTypes.number,
        initUser: PropTypes.func,
        fetchTopics: PropTypes.func,
        fetchTags: PropTypes.func,
        fetchUserRecents: PropTypes.func,
        updateUserRecents: PropTypes.func,
        fetchBookmarks: PropTypes.func,
        synchronizeBookmarks: PropTypes.func,
        setCurrentTags: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Called each time a route changed!

        // Reset current tags
        this.props.setCurrentTags();

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

                    // Send local recent clicks otherwise fetch them
                    const userJustSign = sessionStorage && sessionStorage.getItem('user-connection');

                    Utils.defer.then(() => {
                        if (userJustSign) {
                            sessionStorage.removeItem('user-connection');
                            this.props.updateUserRecents(this.props.currentUserId, getTracksClick(true));
                        } else {
                            this.props.fetchUserRecents(this.props.currentUserId, {limit: 10});
                        }
                    });

                    Utils.defer.then(() => {
                        // if (userJustSign) {
                        //     this.props.synchronizeBookmarks();
                        // }

                        this.props.fetchBookmarks(this.props.currentUserId, {topicId: this.props.currentTopicId});
                    });
                }

                if (this.props.currentTopicId || (this.props.routerState && this.props.routerState.reloadTags)) {
                    this.props.fetchTags({topicId: this.props.currentTopicId}, {}, {topicTags: true});
                }
            });
        } else {
            // Get only all public tags
            this.props.fetchTags({
                visibility: 'everyone'
            }, {
                limit: 200
            });
        }
    }

    componentDidUpdate(prevProps) {
        if ((this.props.currentTopicId !== prevProps.currentTopicId && prevProps.isUserConnected === this.props.isUserConnected) || (prevProps.routerState && prevProps.routerState.reloadTags)) {
            this.props.fetchTags({topicId: this.props.currentTopicId}, {}, {topicTags: true});
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
