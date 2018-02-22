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
    findItemIndex
} from './mutators';

const initState = new Record({
    isFetching: false,
    isProcessing: false,
    errors: new Map(),

    topics: new List(),
    pagination: new Map(),

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
                        return {
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
                currentTopic: payload.topic.id === state.currentTopic.id || findItemIndex(state.topics, payload.topic.id) === -1 ? new Records.TopicRecord(payload.topic) : state.currentTopic
            }));

        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_CHANGE_SUCCESS:
            if (action.user && action.connection) {
                return state.merge({
                    currentTopic: new Records.TopicRecord(action.user.currentTopic)
                });
            } else {
                return state;
            }

        default:
            return state;
    }
};
