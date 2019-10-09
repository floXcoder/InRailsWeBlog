'use strict';

import {
    Record,
    List,
    Map,
    fromJS
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

import {
    toList,
    fetchReducer,
    mutationReducer,
    mutateArray
} from './mutators';

const initState = new Record({
    currentId: window.currentAdminId ? parseInt(window.currentAdminId, 10) : undefined,
    isConnected: !!window.currentAdminId,

    isFetching: false,
    isProcessing: false,

    isSearching: false,
    metaQuery: undefined,
    metaResults: new Map(),

    blogs: new List(),

    errors: new Map()
});

export default function adminReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.ADMIN_META_SEARCH_INIT:
            return state.merge({
                isSearching: false
            });
        case ActionTypes.ADMIN_META_SEARCH_SUCCESS:
            return state.merge({
                isSearching: action.isSearching,
                metaQuery: action.query,
                metaResults: fromJS(action.metaResults)
            });

        case ActionTypes.ADMIN_BLOG_FETCH_INIT:
        case ActionTypes.ADMIN_BLOG_FETCH_SUCCESS:
        case ActionTypes.ADMIN_BLOG_FETCH_ERROR:
            return fetchReducer(state, action, (payload) => ({
                blogs: toList(payload.blogs, Records.AdminBlogRecord)
            }));

        case ActionTypes.ADMIN_BLOG_CHANGE_INIT:
        case ActionTypes.ADMIN_BLOG_CHANGE_SUCCESS:
        case ActionTypes.ADMIN_BLOG_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) => ({
                blogs: mutateArray(state.blogs, payload.blog && (new Records.AdminBlogRecord(payload.blog)))
            }), ['blog']);

        default:
            return state;
    }
};
