'use strict';

import { OPEN_UI_TOPIC_MODULE } from '../constants/actionTypes';

const initState = {
    isTopicOpened: false
};

export default function topicReducer(state = initState, action) {
    switch (action.type) {
        case OPEN_UI_TOPIC_MODULE:
            return {
                ...state,
                isTopicOpened: action.isTopicOpened
            };
        default:
            return state;
    }
};
