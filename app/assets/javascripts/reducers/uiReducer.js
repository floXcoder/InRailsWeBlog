'use strict';

import {
    Record
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

// import * as Records from '../constants/records';

const initState =  new Record({
    isUserPopupOpened: false,
    isUserSignupOpened: false,
    isUserLoginOpened: false,

    isTopicPopupOpened: false,

    articleDisplayMode: 'card'
});

export default function topicReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.UI_SWITCH_USER_HEADER:
            return state.merge({
                isUserPopupOpened: !state.isUserPopupOpened
            });
        case ActionTypes.UI_SWITCH_USER_SIGNUP:
            return state.merge({
                isUserSignupOpened: !state.isUserSignupOpened,
                isUserPopupOpened: false
            });
        case ActionTypes.UI_SWITCH_USER_LOGIN:
            return state.merge({
                isUserLoginOpened: !state.isUserLoginOpened,
                isUserPopupOpened: false
            });

        case ActionTypes.UI_SWITCH_TOPIC_HEADER:
            return state.merge({
                isTopicPopupOpened: !state.isTopicPopupOpened
            });

        case ActionTypes.USER_CHANGE_SUCCESS:
            return state.merge({
                isUserSignupOpened: false,
                isUserLoginOpened: false
            });

        default:
            return state;
    }
};
