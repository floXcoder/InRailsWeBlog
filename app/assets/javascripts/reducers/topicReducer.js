'use strict';

'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    fetchReducer,
    mutationReducer,
    findItemIndex,
    removeIn,
    addOrReplaceIn
} from './mutators';

const initState = {
    isFetching: false,
    isProcessing: false,
    errors: undefined,

    topics: [],
    pagination: {},

    userTopics: [],
    contributedTopics: [],

    currentUserTopicId: window.currentTopicId ? parseInt(window.currentTopicId, 10) : undefined,
    currentUserTopicSlug: window.currentTopicSlug,
    currentTopic: undefined,

    topic: undefined,

    storyTopic: undefined
};

export default function topicReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.TOPIC_FETCH_INIT:
        case ActionTypes.TOPIC_FETCH_SUCCESS:
        case ActionTypes.TOPIC_FETCH_ERROR:
            return fetchReducer(state, action, (state) => {
                if (action.isSwitching) {
                    window.currentUserTopicId = action.topic.id;

                    state.currentUserTopicId = action.topic.id;
                    state.currentUserTopicSlug = action.topic.slug;
                    state.currentTopic = action.topic;

                    if(action.topic.mode === 'stories') {
                        state.storyTopic = action.topic;
                    } else {
                        state.storyTopic = undefined;
                    }
                } else if (action.topic) {
                    state.topic = action.topic;
                } else {
                    state.topics = action.topics || [];
                }
            });

        case ActionTypes.TOPIC_CHANGE_INIT:
        case ActionTypes.TOPIC_CHANGE_SUCCESS:
        case ActionTypes.TOPIC_CHANGE_ERROR:
            return mutationReducer(state, action, (state) => {
                if (action.priority) {
                    // User topics are returned after priority changed
                    state.userTopics = action.topics;
                } else {
                    state.topic = action.topic;
                    if (action.removedId) {
                        state.userTopics = removeIn(state.userTopics, action.removedId);
                    } else {
                        state.userTopics = addOrReplaceIn(state.userTopics, action.topic);
                    }
                    state.currentUserTopicId = (action.topic?.id) === (state.currentTopic?.id) || findItemIndex(state.userTopics, action.topic?.id) !== -1 ? (action.topic && action.topic.id) : state.currentUserTopicId;
                    state.currentUserTopicSlug = (action.topic?.id) === (state.currentTopic?.id) || findItemIndex(state.userTopics, action.topic?.id) !== -1 ? (action.topic?.slug) : state.currentUserTopicSlug;
                    state.currentTopic = (action.topic?.id) === (state.currentTopic?.id) || findItemIndex(state.userTopics, action.topic?.id) !== -1 ? action.topic : state.currentTopic;
                }
            });

        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_CHANGE_SUCCESS:
            if (action.user?.currentTopic && action.connection) {
                state.currentUserTopicSlug = action.user.currentTopic.slug;
                state.currentUserTopicId = action.user.currentTopic.id;
                state.currentTopic = action.user.currentTopic;
                state.userTopics = action.user.topics;
                state.contributedTopics = action.user.contributedTopics;
            }
            return state;

        case ActionTypes.ARTICLE_FETCH_SUCCESS:
            if (action.meta?.storyTopic) {
                state.storyTopic = action.meta.storyTopic;
            } else {
                state.storyTopic = undefined;
            }
            return state;

        default:
            return state;
    }
};
