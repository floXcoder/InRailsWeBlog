'use strict';

import {
    Record
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

const initState = new Record({
    isUserSignupOpened: false,
    isUserLoginOpened: false,
    isUserPreferenceOpened: false,

    isTopicPopupOpened: false,

    articlesLoaderMode: 'infinite',
    articleDisplayMode: 'card',
    articleOrderMode: undefined,

    tagOrderMode: undefined
});

export default function uiReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.UI_SWITCH_USER_SIGNUP:
            return state.merge({
                isUserSignupOpened: !state.isUserSignupOpened
            });
        case ActionTypes.UI_SWITCH_USER_LOGIN:
            return state.merge({
                isUserLoginOpened: !state.isUserLoginOpened
            });
        case ActionTypes.UI_SWITCH_USER_PREFERENCE:
            return state.merge({
                isUserPreferenceOpened: !state.isUserPreferenceOpened
            });

        case ActionTypes.UI_SWITCH_TOPIC_HEADER:
            return state.merge({
                isTopicPopupOpened: !state.isTopicPopupOpened
            });

        case ActionTypes.UI_CHANGE_ARTICLE_ORDER:
            return state.merge({
                articleOrderMode: action.order
            });

        case ActionTypes.UI_CHANGE_TAG_ORDER:
            return state.merge({
                tagOrderMode: action.order
            });

        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_CHANGE_SUCCESS:
            if (action.connection && action.user && action.user.settings) {
                return state.merge({
                    articlesLoaderMode: action.user.settings.articlesLoader,
                    articleDisplayMode: action.user.settings.articleDisplay,
                    articleOrderMode: action.user.settings.articleOrder,
                    tagOrderMode: action.user.settings.tagOrder
                })
            } else if (action.settings) {
                return state.merge({
                    articlesLoaderMode: action.settings.articlesLoader,
                    articleDisplayMode: action.settings.articleDisplay,
                    articleOrderMode: action.settings.articleOrder,
                    tagOrderMode: action.settings.tagOrder
                })
            } else {
                return state;
            }

        default:
            return state;
    }
};
