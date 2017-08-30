'use strict';

import {INIT_USER_SUCCESS, OPEN_TOPIC_MODULE, FETCH_TOPIC_SUCCESS} from '../constants/actionTypes';

const initState = {
    isFetching: false,
    currentTopic: {
        name: ''
    }
};

export default function topicReducer(state = initState, action) {
    switch (action.type) {
        case INIT_USER_SUCCESS:
            return {
                ...state,
                isFetching: action.isFetching,
                currentTopic: action.user.currentTopic,
                topics: action.user.topics
            };
        case FETCH_TOPIC_SUCCESS:
            return {
                ...state,
                isFetching: action.isFetching,
                currentTopic: action.topic
            };
        default:
            return state;
    }
};
