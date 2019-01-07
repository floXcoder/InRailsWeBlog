'use strict';

import {
    Record,
    List
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

const initState = new Record({
    isUserSignupOpen: false,
    isUserLoginOpen: false,
    isUserPreferenceOpen: false,

    isTagSidebarOpen: false,

    isTopicPopupOpen: false,

    articlesLoaderMode: 'infinite',
    articleDisplayMode: 'card',
    articleOrderMode: undefined,

    areArticlesMinimized: false,
    currentArticles: new List(),

    tagOrderMode: undefined
});

export default function uiReducer(state = new initState(), action) {
    switch (action.type) {
        // UI states
        case ActionTypes.UI_SWITCH_USER_SIGNUP:
            return state.merge({
                isUserSignupOpen: !state.isUserSignupOpen
            });
        case ActionTypes.UI_SWITCH_USER_LOGIN:
            return state.merge({
                isUserLoginOpen: !state.isUserLoginOpen
            });
        case ActionTypes.UI_SWITCH_USER_PREFERENCE:
            return state.merge({
                isUserPreferenceOpen: !state.isUserPreferenceOpen
            });

        case ActionTypes.UI_SWITCH_TAG_SIDEBAR:
            return state.merge({
                isTagSidebarOpen: action.isOpen
            });

        case ActionTypes.UI_SWITCH_TOPIC_HEADER:
            return state.merge({
                isTopicPopupOpen: !state.isTopicPopupOpen
            });

        case ActionTypes.UI_CHANGE_ARTICLE_ORDER:
            return state.merge({
                articleOrderMode: action.order
            });
        case ActionTypes.UI_SWITCH_ARTICLE_MINIMIZED:
            return state.merge({
                areArticlesMinimized: !state.areArticlesMinimized
            });
        case ActionTypes.UI_CHANGE_CURRENT_ARTICLES:
            if(action.action === 'add') {
                return state.merge({
                    currentArticles: state.currentArticles.concat(action.article)
                });
            } else {
                return state.merge({
                    currentArticles: state.currentArticles.filter((article) => article === action.article)
                });
            }

        case ActionTypes.UI_CHANGE_TAG_ORDER:
            return state.merge({
                tagOrderMode: action.order
            });

        // Update UI according to user settings
        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_CHANGE_SUCCESS:
            if (action.connection && action.user && action.user.settings) {
                return state.merge(Utils.compact({
                    articlesLoaderMode: action.user.settings.articlesLoader,
                    articleDisplayMode: action.user.settings.articleDisplay,
                    articleOrderMode: action.user.settings.articleOrder,
                    tagOrderMode: action.user.settings.tagOrder,
                    isTagSidebarOpen: !action.user.settings.tagSidebarPin
                }));
            } else if (action.settings && action.meta && !action.meta.topic) {
                return state.merge(Utils.compact({
                    articlesLoaderMode: action.settings.articlesLoader,
                    articleDisplayMode: action.settings.articleDisplay,
                    articleOrderMode: action.settings.articleOrder,
                    tagOrderMode: action.settings.tagOrder,
                    isTagSidebarOpen: !action.settings.tagSidebarPin
                }));
            } else if (action.settings && action.meta && action.meta.topic) {
                return state.merge(Utils.compact({
                    articlesLoaderMode: action.settings.articlesLoader,
                    articleDisplayMode: action.settings.articleDisplay,
                    articleOrderMode: action.settings.articleOrder,
                    tagOrderMode: action.settings.tagOrder,
                    isTagSidebarOpen: !action.settings.tagSidebarPin
                }));
            } else {
                return state;
            }


        case ActionTypes.TOPIC_FETCH_SUCCESS:
            if (action.isSwitching && action.topic && action.topic.settings) {
                return state.merge({
                    isTopicPopupOpen: false,
                    isTagSidebarOpen: !action.topic.settings.tagSidebarPin
                })
            } else {
                return state;
            }

        default:
            return state;
    }
};
