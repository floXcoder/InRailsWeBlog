'use strict';

'use strict';

import {
    Record,
    List,
    Map
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

import {
    toList,
    fetchReducer,
    mutationReducer,
    findItemIndex,
    mutateArray
} from './mutators';

const initState = new Record({
    isFetching: false,
    isProcessing: false,
    errors: new Map(),

    topics: new List(),
    metaTags: new Map(),
    pagination: new Map(),

    userTopics: new List(),
    contributedTopics: new List(),

    currentUserTopicId: window.currentTopicId ? parseInt(window.currentTopicId, 10) : undefined,
    currentUserTopicSlug: window.currentTopicSlug,
    currentTopic: undefined,

    topic: undefined
});

export default function topicReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.TOPIC_FETCH_INIT:
        case ActionTypes.TOPIC_FETCH_SUCCESS:
        case ActionTypes.TOPIC_FETCH_ERROR:
            return fetchReducer(state, action, (payload) => {
                    if (payload.isSwitching) {
                        window.currentUserTopicId = payload.topic.id;

                        return {
                            currentUserTopicId: payload.topic.id,
                            currentUserTopicSlug: payload.topic.slug,
                            currentTopic: new Records.TopicRecord(payload.topic)
                        };
                    } else if (payload.topic) {
                        return {
                            topic: new Records.TopicRecord(payload.topic)
                        };
                    } else {
                        return {
                            topics: toList(payload.topics, Records.TopicRecord)
                        };
                    }
                }
                , ['isSwitching']);

        case ActionTypes.TOPIC_CHANGE_INIT:
        case ActionTypes.TOPIC_CHANGE_SUCCESS:
        case ActionTypes.TOPIC_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) => ({
                topic: payload.topic ? new Records.TopicRecord(payload.topic) : undefined,
                userTopics: mutateArray(state.userTopics, payload.topic && (new Records.TagRecord(payload.topic)), action.removedId),
                currentUserTopicId: (payload.topic && payload.topic.id) === (state.currentTopic && state.currentTopic.id) || findItemIndex(state.userTopics, payload.topic.id) === -1 ? (payload.topic && payload.topic.id) : state.currentUserTopicId,
                currentUserTopicSlug: (payload.topic && payload.topic.id) === (state.currentTopic && state.currentTopic.id) || findItemIndex(state.userTopics, payload.topic.id) === -1 ? (payload.topic && payload.topic.slug) : state.currentUserTopicSlug,
                currentTopic: (payload.topic && payload.topic.id) === (state.currentTopic && state.currentTopic.id) || findItemIndex(state.userTopics, payload.topic.id) === -1 ? new Records.TopicRecord(payload.topic) : state.currentTopic
            }));

        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_CHANGE_SUCCESS:
            if (action.user && action.connection && action.user.currentTopic) {
                return state.merge({
                    currentUserTopicSlug: action.user.currentTopic.slug,
                    currentUserTopicId: action.user.currentTopic.id,
                    currentTopic: new Records.TopicRecord(action.user.currentTopic),
                    userTopics: toList(action.user.topics, Records.TopicRecord),
                    contributedTopics: toList(action.user.contributedTopics, Records.TopicRecord)
                });
            } else {
                return state;
            }

        default:
            return state;
    }
};
