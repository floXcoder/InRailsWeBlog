'use strict';

import * as ActionTypes from '../constants/actionTypes';

// Users
export const switchUserSignup = () => ({
    type: ActionTypes.UI_SWITCH_USER_SIGNUP
});

export const switchUserLogin = () => ({
    type: ActionTypes.UI_SWITCH_USER_LOGIN
});

export const switchUserPreference = () => ({
    type: ActionTypes.UI_SWITCH_USER_PREFERENCE
});

// Topics
export const switchTopicPopup = () => ({
    type: ActionTypes.UI_SWITCH_TOPIC_HEADER
});

// Articles
export const updateArticleOrder = (order) => ({
    type: ActionTypes.UI_CHANGE_ARTICLE_ORDER,
    order
});

// Tags
export const updateTagOrder = (order) => ({
    type: ActionTypes.UI_CHANGE_TAG_ORDER,
    order
});
