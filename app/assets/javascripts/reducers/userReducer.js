
import * as ActionTypes from '@js/constants/actionTypes';

import {
    fetchReducer,
    mutationReducer,
    removeIn
} from '@js/reducers/mutators';

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

            return fetchReducer(state, action, (state) => {
                if (action.connection) {
                    window.currentUserId = action.user.id;
                    window.currentSlug = action.user.slug;

                    state.isConnected = true;
                    state.currentId = action.user.id;
                    state.currentSlug = action.user.slug;
                    state.user = action.user;
                } else if (action.user) {
                    state.user = action.user;
                } else {
                    state.users = action.users;
                }
            });

        case ActionTypes.USER_CHANGE_INIT:
        case ActionTypes.USER_CHANGE_SUCCESS:
        case ActionTypes.USER_CHANGE_ERROR:
            return mutationReducer(state, action, (state) => {
                if (action.connection && action.user) {
                    window.currentUserId = action.user.id;
                    window.currentSlug = action.user.slug;

                    state.isConnected = true;
                    state.currentId = action.user.id;
                    state.currentSlug = action.user.slug;
                    state.user = action.user;
                } else if (action.settings && (!action.meta || !action.meta.topic)) {
                    state.user = state.user && {...state.user, settings: action.settings};
                } else if (action.user) {
                    state.user = action.user;
                } else if (action.removedId) {
                    removeIn(state.topics, action.removedId);
                } else {
                    state.isConnected = false;
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
