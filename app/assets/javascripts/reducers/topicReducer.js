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
            if (action.errors) {
                state.topic = undefined;
                state.topics = [];
            }

            return fetchReducer(state, action, (newState) => {
                if (action.isSwitching) {
                    window.currentUserTopicId = action.topic.id;

                    newState.currentUserTopicId = action.topic.id;
                    newState.currentUserTopicSlug = action.topic.slug;
                    newState.currentTopic = action.topic;

                    if (newState.topic.mode === 'stories') {
                        state.storyTopic = action.topic;
                    } else {
                        newState.storyTopic = undefined;
                    }
                } else if (action.topic) {
                    newState.topic = action.topic;
                } else {
                    newState.topics = action.topics || [];
                }
            });

        case ActionTypes.TOPIC_CHANGE_INIT:
        case ActionTypes.TOPIC_CHANGE_SUCCESS:
        case ActionTypes.TOPIC_CHANGE_ERROR:
            return mutationReducer(state, action, (newState) => {
                if (action.priority) {
                    // User topics are returned after priority changed
                    newState.userTopics = action.topics;
                } else {
                    newState.topic = action.topic;
                    if (action.removedId) {
                        newState.userTopics = removeIn(newState.userTopics, action.removedId);
                    } else {
                        newState.userTopics = addOrReplaceIn(newState.userTopics, action.topic);
                    }
                    newState.currentUserTopicId = (action.topic?.id) === (newState.currentTopic?.id) || findItemIndex(newState.userTopics, action.topic?.id) !== -1 ? (action.topic && action.topic.id) : newState.currentUserTopicId;
                    newState.currentUserTopicSlug = (action.topic?.id) === (newState.currentTopic?.id) || findItemIndex(newState.userTopics, action.topic?.id) !== -1 ? (action.topic?.slug) : newState.currentUserTopicSlug;
                    newState.currentTopic = (action.topic?.id) === (newState.currentTopic?.id) || findItemIndex(newState.userTopics, action.topic?.id) !== -1 ? action.topic : newState.currentTopic;
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
}
