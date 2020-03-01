'use strict';

import * as ActionTypes from '../constants/actionTypes';

const initState = {
    metaTags: window.defaultMetaTags || {},

    isUserSignupOpen: false,
    isUserLoginOpen: false,
    isUserPreferenceOpen: false,
    userPreferenceView: undefined,

    isTagSidebarOpen: false,

    isTopicPopupOpen: false,

    articlesLoaderMode: 'infinite',
    articleDisplayMode: 'card',
    articleOrderMode: undefined,
    articleMultilanguage: false,

    areArticlesMinimized: false,
    currentArticles: [],

    tagOrderMode: undefined,
};

const _updateSettings = (state, settings) => {
    if(settings && typeof settings.articlesLoader === 'string') {
        state.articlesLoaderMode = settings.articlesLoader;
    }
    if(settings && typeof settings.articleDisplayMode === 'string') {
        state.articleDisplayMode = settings.articleDisplayMode;
    }
    if(settings && typeof settings.articleOrder === 'string') {
        state.articleOrderMode = settings.articleOrder;
    }
    if(settings && typeof settings.articleMultilanguage === 'boolean') {
        state.articleMultilanguage = settings.articleMultilanguage;
    }
    if(settings && typeof settings.tagOrderMode === 'string') {
        state.tagOrderMode = settings.tagOrderMode;
    }
    if(settings && typeof settings.tagSidebarPin === 'boolean') {
        state.isTagSidebarOpen = !settings.tagSidebarPin;
    }
};

export default function uiReducer(state = initState, action) {
    switch (action.type) {
        // Get metaTags
        case ActionTypes.UI_CHANGE_META_TAGS:
        case ActionTypes.ARTICLE_FETCH_SUCCESS:
        case ActionTypes.ARTICLE_HISTORY:
        case ActionTypes.TAG_FETCH_SUCCESS:
        case ActionTypes.COMMENT_FETCH_SUCCESS:
        case ActionTypes.SEARCH_FETCH_SUCCESS:
            if(action.meta?.metaTags) {
                state.metaTags = action.meta.metaTags;
            }
            return state;

        // Update UI according to user settings
        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_CHANGE_SUCCESS:
            if(action.meta?.metaTags) {
                state.metaTags = action.meta.metaTags;
            }
            if (action.connection && action.user?.settings) {
                _updateSettings(state, {...action.user.settings, ...(action.user.currentTopic?.settings || {})});
            } else if (action.settings && action.meta && !action.meta.topic) {
                _updateSettings(state, action.user?.currentTopic ? action.user.currentTopic.settings : action.settings);
            } else if (action.settings && action.meta && action.meta.topic) {
                _updateSettings(state, action.settings);
            }
            return state;
        case ActionTypes.TOPIC_FETCH_SUCCESS:
            if(action.meta?.metaTags) {
                state.metaTags = action.meta.metaTags;
            }
            if (action.isSwitching && action.topic?.settings) {
                state.isTopicPopupOpen = false;
                state.articleOrderMode = typeof action.topic.settings.articleOrder === 'string' ? action.topic.settings.articleOrder : state.articleOrder;
                state.isTagSidebarOpen = typeof action.topic.settings.tagSidebarPin === 'boolean' ? !action.topic.settings.tagSidebarPin : state.isTagSidebarOpen;
            }
            return state;

        // UI states
        case ActionTypes.UI_SWITCH_USER_SIGNUP:
            state.isUserSignupOpen = !state.isUserSignupOpen;
            return state;
        case ActionTypes.UI_SWITCH_USER_LOGIN:
            state.isUserLoginOpen = !state.isUserLoginOpen;
            return state;
        case ActionTypes.UI_SWITCH_USER_PREFERENCE:
            state.isUserPreferenceOpen = !state.isUserPreferenceOpen;
            state.userPreferenceView = action.view;
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

        default:
            return state;
    }
};
