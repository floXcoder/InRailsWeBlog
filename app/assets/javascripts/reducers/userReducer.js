'use strict';

import {
    Record,
    Map,
    List
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

import {
    toList,
    fetchReducer,
    mutationReducer
} from './mutators';

const initState = new Record({
    // Required for fetchReducer/mutationReducer
    isFetching: false,
    isProcessing: false,
    errors: new Map(),

    currentId: window.currentUserId ? parseInt(window.currentUserId, 10) : undefined,
    currentSlug: window.currentUserSlug,
    isConnected: !!window.currentUserId,
    isLoaded: false,
    isAdminConnected: !!window.currentAdminId,

    users: new List(),
    pagination: new Map(),

    user: undefined,

    recentTopics: new List(),
    recentTags: new List(),
    recentArticles: new List()
});

export default function userReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.USER_FETCH_INIT:
        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_FETCH_ERROR:
            return fetchReducer(state, action, (payload) => {
                if (payload.connection) {
                    window.currentUserId = payload.user.id;

                    return {
                        currentId: payload.user.id,
                        user: new Records.UserRecord(payload.user),
                        isLoaded: payload.connection && !!payload.user,
                        isConnected: true
                    };
                } else if (payload.user) {
                    return {
                        user: new Records.UserRecord(payload.user),
                        isLoaded: payload.connection && !!payload.user
                    };
                } else {
                    return {
                        users: toList(payload.users, Records.UserRecord)
                    };
                }
            }, ['connection']);

        case ActionTypes.USER_CHANGE_INIT:
        case ActionTypes.USER_CHANGE_SUCCESS:
        case ActionTypes.USER_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) => {
                if (payload.connection) {
                    window.currentUserId = payload.user.id;

                    return {
                        currentId: payload.user.id,
                        user: new Records.UserRecord(payload.user),
                        isConnected: true
                    };
                } else if (payload.settings && (!payload.meta || !payload.meta.topic)) {
                    return {
                        user: state.user && state.user.merge({settings: new Records.SettingsRecord(payload.settings)})
                    };
                } else if (payload.user) {
                    return {
                        user: new Records.UserRecord(payload.user)
                    };
                } else {
                    return {};
                }
            }, ['connection', 'settings', 'meta']);

        case ActionTypes.USER_RECENTS:
        case ActionTypes.USER_RECENTS_CHANGE_INIT:
        case ActionTypes.USER_RECENTS_CHANGE_SUCCESS:
        case ActionTypes.USER_RECENTS_CHANGE_ERROR:
            return state.merge({
                recentTopics: toList(action.topics, Records.TopicRecord),
                recentTags: toList(action.tags, Records.TagRecord),
                recentArticles: toList(action.articles, Records.ArticleRecord)
            });

        default:
            return state;
    }
};
