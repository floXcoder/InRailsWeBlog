'use strict';

import {FETCH_TOPIC_SUCCESS} from '../constants/actionTypes';

const initState = {
    isFetching: false,
    tags: []
};

export default function tagReducer(state = initState, action) {
    switch (action.type) {
        case FETCH_TOPIC_SUCCESS:
            return {
                ...state,
                isFetching: action.isFetching,
                tags: action.topic.tags
            };
        default:
            return state;
    }
};
