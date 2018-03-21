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
            return fetchReducer(state, action, (payload) =>
                payload.user ? ({
                    user: new Records.UserRecord(payload.user),
                    isLoaded: payload.connection && !!payload.user
                }) : ({
                    users: toList(payload.users, Records.UserRecord)
                }), ['connection']);

        case ActionTypes.USER_CHANGE_INIT:
        case ActionTypes.USER_CHANGE_SUCCESS:
        case ActionTypes.USER_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) => {
                if (payload.connection) {
                    return {
                        user: new Records.UserRecord(payload.user),
                        isConnected: true
                    };
                } else if (payload.settings) {
                    return {
                        user: state.user && state.user.merge({settings: new Records.SettingsRecord(payload.settings)})
                    };
                } else {
                    return {
                        user: new Records.UserRecord(payload.user)
                    };
                }
            }, ['connection', 'settings']);

        case ActionTypes.USER_RECENTS:
            return state.merge({
                recentTopics: toList(action.recentTopics, Records.TopicRecord),
                recentTags: toList(action.recentTags, Records.TagRecord),
                recentArticles: toList(action.recentArticles, Records.ArticleRecord)
            });

        default:
            return state;
    }
};
