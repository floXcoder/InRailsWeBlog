'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    fetchReducer,
    mutationReducer
} from './mutators';

const initState = {
    // Required for fetchReducer/mutationReducer
    isFetching: false,
    isProcessing: false,
    errors: undefined,

    currentId: window.currentUserId ? parseInt(window.currentUserId, 10) : undefined,
    currentSlug: window.currentUserSlug,
    isConnected: !!window.currentUserId,
    isLoaded: false,
    isAdminConnected: !!window.currentAdminId,

    users: [],
    pagination: {},

    user: undefined,

    recentTopics: [],
    recentTags: [],
    recentArticles: []
};

export default function userReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.USER_FETCH_INIT:
        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_FETCH_ERROR:
            return fetchReducer(state, action, (state) => {
                if (action.connection) {
                    window.currentUserId = action.user.id;

                    state.currentId = action.user.id;
                    state.user = action.user;
                    state.isLoaded = action.connection && !!action.user;
                    state.isConnected = true;
                } else if (action.user) {
                    state.user = action.user;
                    state.isLoaded = action.connection && !!action.user;
                } else {
                    state.users = action.users
                }
            });

        case ActionTypes.USER_CHANGE_INIT:
        case ActionTypes.USER_CHANGE_SUCCESS:
        case ActionTypes.USER_CHANGE_ERROR:
            return mutationReducer(state, action, (state) => {
                if (action.connection) {
                    window.currentUserId = action.user.id;

                    state.currentId = action.user.id;
                    state.user = action.user;
                    state.isConnected = true;
                } else if (action.settings && (!action.meta || !action.meta.topic)) {
                    state.user = state.user && {...state.user, settings: action.settings};
                } else if (action.user) {
                    state.user = action.user;
                }
            });

        case ActionTypes.USER_RECENTS:
        case ActionTypes.USER_RECENTS_CHANGE_INIT:
        case ActionTypes.USER_RECENTS_CHANGE_SUCCESS:
        case ActionTypes.USER_RECENTS_CHANGE_ERROR:
            if(action.local) {
            } else {
                state.recentTopics = action.topics || state.recentTopics || [];
                state.recentTags = action.tags || state.recentTags || [];
                state.recentArticles = action.articles || state.recentArticles || [];
            }
            return state;

        default:
            return state;
    }
};
