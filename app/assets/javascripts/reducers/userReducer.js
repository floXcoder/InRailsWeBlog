'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    fetchReducer,
    mutationReducer,
    removeIn
} from './mutators';

const initState = {
    // Required for fetchReducer/mutationReducer
    isFetching: false,
    isProcessing: false,
    errors: undefined,

    currentId: window.currentUserId ? parseInt(window.currentUserId, 10) : undefined,
    currentSlug: window.currentUserSlug,
    isConnected: !!window.currentUserId,
    isAdminConnected: !!window.currentAdminId,

    users: [],
    pagination: {},

    user: undefined,

    recentTopics: [],
    recentTags: [],
    recentArticles: [],
    recentUpdatedArticles: []
};

export default function userReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.USER_FETCH_INIT:
        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_FETCH_ERROR:
            if (action.errors) {
                state.user = undefined;
                state.users = [];
            }

            return fetchReducer(state, action, (newState) => {
                if (action.connection) {
                    window.currentUserId = action.user.id;
                    window.currentSlug = action.user.slug;

                    newState.isConnected = true;
                    newState.currentId = action.user.id;
                    newState.currentSlug = action.user.slug;
                    newState.user = action.user;
                } else if (action.user) {
                    newState.user = action.user;
                } else {
                    newState.users = action.users;
                }
            });

        case ActionTypes.USER_CHANGE_INIT:
        case ActionTypes.USER_CHANGE_SUCCESS:
        case ActionTypes.USER_CHANGE_ERROR:
            return mutationReducer(state, action, (newState) => {
                if (action.connection && action.user) {
                    window.currentUserId = action.user.id;
                    window.currentSlug = action.user.slug;

                    newState.isConnected = true;
                    newState.currentId = action.user.id;
                    newState.currentSlug = action.user.slug;
                    newState.user = action.user;
                } else if (action.settings && (!action.meta || !action.meta.topic)) {
                    newState.user = state.user && {...newState.user, settings: action.settings};
                } else if (action.user) {
                    newState.user = action.user;
                } else if (action.removedId) {
                    removeIn(newState.topics, action.removedId);
                } else {
                    newState.isConnected = false;
                }
            });

        case ActionTypes.USER_RECENTS:
        case ActionTypes.USER_RECENTS_CHANGE_INIT:
        case ActionTypes.USER_RECENTS_CHANGE_SUCCESS:
        case ActionTypes.USER_RECENTS_CHANGE_ERROR:
            if (!action.local) {
                state.recentTopics = action.topics || state.recentTopics || [];
                state.recentTags = action.tags || state.recentTags || [];
                state.recentArticles = action.articles || state.recentArticles || [];
                state.recentUpdatedArticles = action.updatedArticles || state.updatedArticles || [];
            }

            return state;

        default:
            return state;
    }
}
