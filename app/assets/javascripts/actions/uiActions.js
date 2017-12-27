'use strict';

import * as ActionTypes from '../constants/actionTypes';

// Users
export const switchUserPopup = () => ({
    type: ActionTypes.UI_SWITCH_USER_HEADER
});

export const switchUserSignup = () => ({
    type: ActionTypes.UI_SWITCH_USER_SIGNUP
});

export const switchUserLogin = () => ({
    type: ActionTypes.UI_SWITCH_USER_LOGIN
});

// Topics
export const switchTopicPopup = () => ({
    type: ActionTypes.UI_SWITCH_TOPIC_HEADER
});
