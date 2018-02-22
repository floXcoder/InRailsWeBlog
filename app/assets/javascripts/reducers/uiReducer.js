'use strict';

import {
    Record
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

const initState = new Record({
    isUserSignupOpened: false,
    isUserLoginOpened: false,

    isTopicPopupOpened: false,

    articlesLoaderMode: 'infinite',
    articleDisplayMode: 'card',
    articleOrderMode: undefined
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

        case ActionTypes.UI_SWITCH_TOPIC_HEADER:
            return state.merge({
                isTopicPopupOpened: !state.isTopicPopupOpened
            });

        case ActionTypes.UI_CHANGE_ARTICLE_ORDER:
            return state.merge({
                articleOrderMode: action.order
            });

        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_CHANGE_SUCCESS:
            if ((action.user && action.connection) || action.settings) {
                return state.merge({
                    articlesLoaderMode: action.connection ? action.user.settings.articlesLoader : action.settings.articlesLoader,
                    articleDisplayMode: action.connection ? action.user.settings.articleDisplay : action.settings.articleDisplay,
                    articleOrderMode: action.connection ? action.user.settings.articleOrder : action.settings.articleOrder
                })
            } else {
                return state;
            }

        default:
            return state;
    }
};
