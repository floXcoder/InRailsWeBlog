'use strict';

'use strict';

import {
    Record,
    Map
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

import {
    toList,
    fetchReducer,
    mutationReducer
} from './mutators';

const initState = new Record({
    isFetching: false,
    isProcessing: false,
    errors: new Map(),

    currentTopic: undefined
});

export default function topicReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.TOPIC_FETCH_INIT:
        case ActionTypes.TOPIC_FETCH_SUCCESS:
        case ActionTypes.TOPIC_FETCH_ERROR:
            return fetchReducer(state, action, (payload) =>
                payload.topic ? ({
                    topic: new Records.TopicRecord(payload.topic)
                }) : ({
                    topics: toList(payload.topics, Records.TopicRecord)
                })
            );

        case ActionTypes.TOPIC_CHANGE_INIT:
        case ActionTypes.TOPIC_CHANGE_SUCCESS:
        case ActionTypes.TOPIC_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) => ({
                topic: payload.topic ? new Records.TopicRecord(payload.topic) : undefined
            }));

        case ActionTypes.USER_CHANGE_SUCCESS:
            if (action.user && action.connection) {
                return state.merge({
                    currentTopic: action.user.currentTopic
                });
            } else {
                return state;
            }

        default:
            return state;
    }
};
