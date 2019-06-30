'use strict';

import {
    initUser,
    fetchTags,
    switchTopic,
    getTracksClick,
    fetchUserRecents,
    updateUserRecents,
    fetchBookmarks,
    synchronizeBookmarks,
    setCurrentTags
} from '../../../actions';

import {
    getUserTopics
} from '../../../selectors';

export default @connect((state) => ({
    userId: state.userState.currentId,
    currentUser: state.userState.user,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    userTopics: getUserTopics(state)
}), {
    initUser,
    fetchTags,
    switchTopic,
    fetchUserRecents,
    updateUserRecents,
    fetchBookmarks,
    synchronizeBookmarks,
    setCurrentTags
})
class UserManager extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        routeState: PropTypes.object,
        // from connect
        userId: PropTypes.number,
        currentUser: PropTypes.object,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        userTopics: PropTypes.array,
        initUser: PropTypes.func,
        fetchTags: PropTypes.func,
        switchTopic: PropTypes.func,
        fetchUserRecents: PropTypes.func,
        updateUserRecents: PropTypes.func,
        fetchBookmarks: PropTypes.func,
        setCurrentTags: PropTypes.func
    };

    static defaultProps = {
        routeState: {}
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Load user environment:
        // Get current user details with all topics (called each time route has changed)
        // currentUser is defined only when route changed
        if (!this.props.currentUser) {
            this.props.initUser(this.props.userId, {
                profile: true,
                topicSlug: this.props.routeParams.topicSlug,
                articleSlug: this.props.routeParams.articleSlug
            })
                .fetch.then((response) => {
                if (response && response.user) {
                    const currentTopicSlug = (this.props.routeParams.topicSlug || this.props.routeParams.articleSlug) && response.user.currentTopic ? response.user.currentTopic.slug : null;
                    if (currentTopicSlug) {
                        this.props.fetchTags({
                                topicSlug: currentTopicSlug
                            },
                            {},
                            {
                                topicTags: true
                            });
                    } else if (response.user.id) {
                        this.props.fetchTags({
                            userId: response.user.id
                        });
                    }

                    // Send local recent clicks otherwise fetch them
                    const userJustSign = sessionStorage && sessionStorage.getItem('user-connection');

                    Utils.defer.then(() => {
                        if (userJustSign) {
                            sessionStorage.removeItem('user-connection');
                            this.props.updateUserRecents(this.props.userId, getTracksClick(true));
                        } else {
                            this.props.fetchUserRecents(this.props.userId, {limit: 10});
                        }
                    });

                    Utils.defer.then(() => {
                        // if (userJustSign) {
                        //     this.props.synchronizeBookmarks();
                        // }

                        // this.props.fetchBookmarks(this.props.userId, {topicId: this.props.currentUserTopicId});

                        this.props.fetchBookmarks(this.props.userId);
                    });
                }
            });
        } else {
            // Called when route changed
            this._checkState();

            // Reset current tags
            this.props.setCurrentTags();
        }
    }

    componentDidUpdate(prevProps) {
        // Called when hash route change (topic module, ...)
        // Check state only if previous current user defined (otherwise it means initialization)
        if(prevProps.currentUser) {
            this._checkState();
        }
    }

    _checkState = () => {
        let topicSlug = this.props.routeParams.topicSlug;

        // Extract topicSlug from article if any
        if (this.props.routeParams.articleSlug) {
            topicSlug = this.props.routeParams.articleSlug.match(/@.*?$/).first().substr(1);
        }

        this._checkTopic(topicSlug);

        this._fetchTags(topicSlug);
    };

    _fetchTags = (topicSlug) => {
        // Load tags according to the current route
        // Fetch tags only if different topic
        if (this.props.routeState.reloadTags) {
            this.props.fetchTags({
                    topicId: this.props.currentUserTopicId
                },
                {},
                {
                    topicTags: true
                });
        } else if (!topicSlug) {
            this.props.fetchTags({
                userId: this.props.userId
            });
        } else if (this.props.currentUserTopicSlug !== topicSlug) {
            this.props.fetchTags({
                    topicSlug: topicSlug
                },
                {},
                {
                    topicTags: true
                });
        }
    };

    _checkTopic = (topicSlug) => {
        // Switch topic only if new topic belongs to current user
        if (!this.props.userTopics.some((topic) => topic.slug === topicSlug)) {
            return;
        }

        if (this.props.currentUserTopicSlug !== topicSlug) {
            this.props.switchTopic(this.props.userId, topicSlug);
        }
    };

    render() {
        return React.Children.only(this.props.children);
    }
}
