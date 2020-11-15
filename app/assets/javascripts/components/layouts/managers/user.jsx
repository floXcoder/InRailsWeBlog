'use strict';

import {
    initUser,
    fetchTags,
    switchTopic,
    fetchUserRecents,
    fetchBookmarks,
    synchronizeBookmarks,
    setCurrentTags
} from '../../../actions';

import {
    newTopicParam
} from '../../../constants/routesHelper';

export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUser: state.userState.user,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    userTopics: state.topicState.userTopics,
    topicTags: state.tagState.topicTags
}), {
    initUser,
    fetchTags,
    switchTopic,
    fetchUserRecents,
    fetchBookmarks,
    synchronizeBookmarks,
    setCurrentTags
})
class UserManager extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        routeState: PropTypes.object,
        pushHistory: PropTypes.func,
        initialCurrentUser: PropTypes.object,
        // from connect
        currentUserId: PropTypes.number,
        currentUser: PropTypes.object,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        userTopics: PropTypes.array,
        topicTags: PropTypes.array,
        initUser: PropTypes.func,
        fetchTags: PropTypes.func,
        switchTopic: PropTypes.func,
        fetchUserRecents: PropTypes.func,
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
        // Called each time a route change

        if (!this.props.currentUser) {
            this.props.initUser(this.props.currentUserId, {
                profile: true,
                topicSlug: this.props.routeParams.topicSlug,
                articleSlug: this.props.routeParams.articleSlug,
                localUser: this.props.initialCurrentUser
            })
                .fetch.then((response) => {
                this._fetchUserData(response?.user);
            });
        } else {
            // Called when route changed
            this._checkState();

            // Reset current tags
            this.props.setCurrentTags();
        }
    }

    componentDidUpdate(prevProps) {
        // Called when hash route change (topic module, articles order, ...)
        // Check state only if previous current user defined (otherwise it means initialization)
        if (prevProps.currentUser) {
            this._checkState();
        }
    }

    _fetchUserData = (currentUser) => {
        const currentTopicSlug = (this.props.routeParams.topicSlug || this.props.routeParams.articleSlug) && currentUser.currentTopic ? currentUser.currentTopic.slug : null;
        if (currentTopicSlug) {
            this.props.fetchTags({
                    topicSlug: currentTopicSlug
                },
                {
                    userId: this.props.currentUserId
                },
                {
                    topicTags: true
                });
        } else if (currentUser.id) {
            // Fetch all tags
            this.props.fetchTags({
                userId: currentUser.id
            });

            if (currentUser.currentTopic) {
                if(currentUser.currentTopic.slug !== this.props.routeParams.topicSlug) {
                    this._checkState();
                } else {
                    // Fetch also current topic tags
                    this.props.fetchTags({
                            topicSlug: currentUser.currentTopic.slug
                        },
                        {
                            userId: this.props.currentUserId
                        },
                        {
                            topicTags: true
                        });
                }
            }
        }

        // Send local recent clicks otherwise fetch them
        const userJustSign = sessionStorage?.getItem('user-signed');

        Utils.defer.then(() => {
            const isNewSession = sessionStorage.getItem('userRecents');

            if (userJustSign) {
                sessionStorage.removeItem('user-signed');
                this.props.pushHistory({
                    hash: '#' + newTopicParam,
                    state: {
                        topicId: currentUser.currentTopic.id,
                        signup: true
                    }
                });
            } else if (!isNewSession) {
                this.props.fetchUserRecents(this.props.currentUserId, {limit: 10});
            }
        });

        Utils.defer.then(() => {
            // if (userJustSign) {
            //     this.props.synchronizeBookmarks();
            // }

            // this.props.fetchBookmarks(this.props.userId, {topicId: this.props.currentUserTopicId});

            this.props.fetchBookmarks(this.props.currentUserId);
        });
    }

    _checkState = () => {
        let topicSlug = this.props.routeParams.topicSlug;

        // Extract topicSlug from article if any
        if (this.props.routeParams.articleSlug) {
            topicSlug = this.props.routeParams.articleSlug.match(/@.*?$/)?.first()?.substr(1);
        }

        if (topicSlug) {
            this._checkTopic(topicSlug);
        }

        this._fetchTags(topicSlug);
    };

    _fetchTags = (topicSlug) => {
        // Load tags according to the current route
        // Fetch tags only if different topic
        if (this.props.routeState.reloadTags) {
            this.props.fetchTags({
                    topicId: this.props.currentUserTopicId
                },
                {
                    userId: this.props.currentUserId
                },
                {
                    topicTags: true
                });
        } else if (!topicSlug) {
            this.props.fetchTags({
                userId: this.props.currentUserId
            });
        } else if (this.props.currentUserTopicSlug !== topicSlug && this.props.userTopics.map((topic) => topic.slug).includes(topicSlug)) {
            this.props.fetchTags({
                    topicSlug: topicSlug
                },
                {
                    userId: this.props.currentUserId
                },
                {
                    topicTags: true
                });
        } else if(!this.props.topicTags) {
            this.props.fetchTags({
                    topicId: this.props.currentUserTopicId
                },
                {
                    userId: this.props.currentUserId
                },
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
            this.props.switchTopic(this.props.currentUserId, topicSlug);
        }
    };

    render() {
        return React.Children.only(this.props.children);
    }
}
