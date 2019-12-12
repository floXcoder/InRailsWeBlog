'use strict';

import * as ActionTypes from '../constants/actionTypes';

const initState = {
    isUserSignupOpen: false,
    isUserLoginOpen: false,
    isUserPreferenceOpen: false,

    isTagSidebarOpen: false,

    isTopicPopupOpen: false,

    articlesLoaderMode: 'infinite',
    articleDisplayMode: 'card',
    articleOrderMode: undefined,

    areArticlesMinimized: false,
    currentArticles: [],

    tagOrderMode: undefined
};

export default function uiReducer(state = initState, action) {
    switch (action.type) {
        // UI states
        case ActionTypes.UI_SWITCH_USER_SIGNUP:
            state.isUserSignupOpen = !state.isUserSignupOpen;
            return state;
        case ActionTypes.UI_SWITCH_USER_LOGIN:
            state.isUserLoginOpen = !state.isUserLoginOpen;
            return state;
        case ActionTypes.UI_SWITCH_USER_PREFERENCE:
            state.isUserPreferenceOpen = !state.isUserPreferenceOpen;
            return state;

        case ActionTypes.UI_SWITCH_TAG_SIDEBAR:
            state.isTagSidebarOpen = action.isOpen;
            return state;

        case ActionTypes.UI_SWITCH_TOPIC_HEADER:
            state.isTopicPopupOpen = !state.isTopicPopupOpen;
            return state;

        case ActionTypes.UI_CHANGE_ARTICLE_ORDER:
            state.articleOrderMode = action.order;
            return state;
        case ActionTypes.UI_SWITCH_ARTICLE_MINIMIZED:
            state.areArticlesMinimized = !state.areArticlesMinimized;
            return state;
        case ActionTypes.UI_CHANGE_CURRENT_ARTICLES:
            if (action.action === 'add') {
                state.currentArticles.push(action.articleId)
            } else {
                state.currentArticles = state.currentArticles.filter((articleId) => articleId !== action.articleId)
            }
            return state;

        case ActionTypes.UI_CHANGE_TAG_ORDER:
            state.tagOrderMode = action.order;
            return state;

        // Update UI according to user settings
        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_CHANGE_SUCCESS:
            if (action.connection && action.user && action.user.settings) {
                state.articlesLoaderMode = action.user.currentTopic && action.user.currentTopic.settings && typeof action.user.currentTopic.settings.articlesLoader === 'string' ? action.user.currentTopic.settings.articlesLoader : action.user.settings.articlesLoader;
                state.articleDisplayMode = action.user.currentTopic && action.user.currentTopic.settings && typeof action.user.currentTopic.settings.articleDisplay === 'string' ? action.user.currentTopic.settings.articleDisplay : action.user.settings.articleDisplay;
                state.articleOrderMode = action.user.currentTopic && action.user.currentTopic.settings && typeof action.user.currentTopic.settings.articleOrder === 'string' ? action.user.currentTopic.settings.articleOrder : action.user.settings.articleOrder;
                state.tagOrderMode = action.user.currentTopic && action.user.currentTopic.settings && typeof action.user.currentTopic.settings.tagOrder === 'string' ? action.user.currentTopic.settings.tagOrder : action.user.settings.tagOrder;
                state.isTagSidebarOpen = action.user.currentTopic && action.user.currentTopic.settings && typeof action.user.currentTopic.settings.tagSidebarPin === 'boolean' ? !action.user.currentTopic.settings.tagSidebarPin : !action.user.settings.tagSidebarPin
            } else if (action.settings && action.meta && !action.meta.topic) {
                state.articlesLoaderMode = action.user && action.user.currentTopic && action.user.currentTopic.settings && typeof action.user.currentTopic.settings.articlesLoader === 'string' ? action.user.currentTopic.settings.articlesLoader : action.settings.articlesLoader;
                state.articleDisplayMode = action.user && action.user.currentTopic && action.user.currentTopic.settings && typeof action.user.currentTopic.settings.articleDisplay === 'string' ? action.user.currentTopic.settings.articleDisplay : action.settings.articleDisplay;
                state.articleOrderMode = action.user && action.user.currentTopic && action.user.currentTopic.settings && typeof action.user.currentTopic.settings.articleOrder === 'string' ? action.user.currentTopic.settings.articleOrder : action.settings.articleOrder;
                state.tagOrderMode = action.user && action.user.currentTopic && action.user.currentTopic.settings && typeof action.user.currentTopic.settings.tagOrder === 'string' ? action.user.currentTopic.settings.tagOrder : action.settings.tagOrder;
                state.isTagSidebarOpen = action.user && action.user.currentTopic && action.user.currentTopic.settings && typeof action.user.currentTopic.settings.tagSidebarPin === 'boolean' ? !action.user.currentTopic.settings.tagSidebarPin : !action.settings.tagSidebarPin
            } else if (action.settings && action.meta && action.meta.topic) {
                state.articlesLoaderMode = action.settings.articlesLoader;
                state.articleDisplayMode = action.settings.articleDisplay;
                state.articleOrderMode = action.settings.articleOrder;
                state.tagOrderMode = action.settings.tagOrder;
                state.isTagSidebarOpen = !action.settings.tagSidebarPin;
            }
            return state;

        case ActionTypes.TOPIC_FETCH_SUCCESS:
            if (action.isSwitching && action.topic && action.topic.settings) {
                state.isTopicPopupOpen = false;
                state.articleOrderMode = typeof action.topic.settings.articleOrder === 'string' ? action.topic.settings.articleOrder : state.articleOrder;
                state.isTagSidebarOpen = typeof action.topic.settings.tagSidebarPin === 'boolean' ? !action.topic.settings.tagSidebarPin : state.isTagSidebarOpen;
            }
            return state;

        default:
            return state;
    }
};
