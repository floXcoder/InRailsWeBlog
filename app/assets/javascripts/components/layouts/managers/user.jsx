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
    getHasTopicTags
} from '../../../selectors';

import {
    newTopicParam
} from '../../../constants/routesHelper';

import withRouter from '../../modules/router';


export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUser: state.userState.user,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    userTopics: state.topicState.userTopics,
    hasTopicTags: getHasTopicTags(state)
}), {
    initUser,
    fetchTags,
    switchTopic,
    fetchUserRecents,
    fetchBookmarks,
    synchronizeBookmarks,
    setCurrentTags
})
@withRouter({location: true, params: true, navigate: true})
class UserManager extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        initialCurrentUser: PropTypes.object,
        // from router
        routeLocation: PropTypes.object,
        routeParams: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        currentUserId: PropTypes.number,
        currentUser: PropTypes.object,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        userTopics: PropTypes.array,
        hasTopicTags: PropTypes.bool,
        initUser: PropTypes.func,
        fetchTags: PropTypes.func,
        switchTopic: PropTypes.func,
        fetchUserRecents: PropTypes.func,
        fetchBookmarks: PropTypes.func,
        setCurrentTags: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._userRequest = null;
        this._tagRequest = null;
        this._recentRequest = null;
        this._bookmarkRequest = null;
    }

    componentDidMount() {
        // Load user environment:
        // Get current user details with all topics (called each time route has changed)
        // currentUser is defined only when route changed
        // Called each time a route change

        if (!this.props.currentUser) {
            this._userRequest = this.props.initUser(this.props.currentUserId, {
                profile: true,
                topicSlug: this.props.routeParams.topicSlug,
                articleSlug: this.props.routeParams.articleSlug,
                localUser: this.props.initialCurrentUser
            });

            this._userRequest.fetch.then((response) => {
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

    componentWillUnmount() {
        if (this._userRequest?.signal) {
            this._userRequest.signal.abort();
        }
        if (this._tagRequest?.signal) {
            this._tagRequest.signal.abort();
        }
        if (this._recentRequest?.signal) {
            this._recentRequest.signal.abort();
        }
        if (this._bookmarkRequest?.signal) {
            this._bookmarkRequest.signal.abort();
        }
    }

    _fetchUserData = (currentUser) => {
        const currentTopicSlug = (this.props.routeParams.topicSlug || this.props.routeParams.articleSlug) && currentUser.currentTopic ? currentUser.currentTopic.slug : null;
        if (currentTopicSlug) {
            this._tagRequest = this.props.fetchTags(
                {
                    topicSlug: currentTopicSlug
                },
                {
                    userId: this.props.currentUserId
                },
                {
                    topicTags: true
                }
            );
        } else if (currentUser.id) {
            // Fetch all tags
            this._tagRequest = this.props.fetchTags({
                userId: currentUser.id
            });

            if (currentUser.currentTopic) {
                if (currentUser.currentTopic.slug !== this.props.routeParams.topicSlug) {
                    this._checkState();
                } else {
                    // Fetch also current topic tags
                    this._tagRequest = this.props.fetchTags(
                        {
                            topicSlug: currentUser.currentTopic.slug
                        },
                        {
                            userId: this.props.currentUserId
                        },
                        {
                            topicTags: true
                        }
                    );
                }
            }
        }

        // Send local recent clicks otherwise fetch them
        const userJustSign = sessionStorage?.getItem('user-signed');

        Utils.defer.then(() => {
            const isNewSession = sessionStorage.getItem('userRecents');

            if (userJustSign) {
                sessionStorage.removeItem('user-signed');
                this.props.routeNavigate({
                    hash: '#' + newTopicParam,
                    state: {
                        topicId: currentUser.currentTopic.id,
                        signup: true
                    }
                });
            } else if (!isNewSession) {
                this._recentRequest = this.props.fetchUserRecents(this.props.currentUserId, {limit: 10});
            }
        });

        Utils.defer.then(() => {
            // if (userJustSign) {
            //     this.props.synchronizeBookmarks();
            // }

            // this.props.fetchBookmarks(this.props.userId, {topicId: this.props.currentUserTopicId});

            this._bookmarkRequest = this.props.fetchBookmarks(this.props.currentUserId);
        });
    };

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
        if (this.props.routeLocation.search.reloadTags) {
            this._tagRequest = this.props.fetchTags(
                {
                    topicId: this.props.currentUserTopicId
                },
                {
                    userId: this.props.currentUserId
                },
                {
                    topicTags: true
                }
            );
        } else if (!topicSlug) {
            this._tagRequest = this.props.fetchTags({
                userId: this.props.currentUserId
            });
        } else if (this.props.currentUserTopicSlug !== topicSlug && this.props.userTopics.map((topic) => topic.slug).includes(topicSlug)) {
            this._tagRequest = this.props.fetchTags(
                {
                    topicSlug: topicSlug
                },
                {
                    userId: this.props.currentUserId
                },
                {
                    topicTags: true
                }
            );
        } else if (!this.props.hasTopicTags) {
            this._tagRequest = this.props.fetchTags(
                {
                    topicId: this.props.currentUserTopicId
                },
                {
                    userId: this.props.currentUserId
                },
                {
                    topicTags: true
                }
            );
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
