'use strict';

import {
    Record
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

const initState =  new Record({
    isTopicOpened: false,

    articleDisplayMode: 'card'
});

export default function topicReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.UI_OPEN_TOPIC_MODULE:
            return state.merge({
                isTopicOpened: action.isTopicOpened
            });

        default:
            return state;
    }
};
