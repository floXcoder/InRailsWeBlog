
import * as ActionTypes from '@js/constants/actionTypes';

import {
    fetchReducer,
    mutationReducer,
    addOrReplaceIn,
    removeIn
} from '@js/reducers/mutators';

const initState = {
    currentId: window.currentAdminId ? parseInt(window.currentAdminId, 10) : undefined,
    isConnected: !!window.currentAdminId,

    isFetching: false,
    isProcessing: false,

    isSearching: false,
    metaQuery: undefined,
    metaResults: {},

    visitsStats: {},
    visitsDetails: [],

    blogs: [],

    seoData: [],

    errors: {}
};

export default function adminReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.ADMIN_META_SEARCH_INIT:
            state.isSearching = false;
            return state;
        case ActionTypes.ADMIN_META_SEARCH_SUCCESS:
            state.isSearching = action.isSearching;
            state.metaQuery = action.query;
            state.metaResults = action.metaResults;
            return state;

        case ActionTypes.ADMIN_VISIT_FETCH_INIT:
        case ActionTypes.ADMIN_VISIT_FETCH_SUCCESS:
        case ActionTypes.ADMIN_VISIT_FETCH_ERROR:
            return fetchReducer(state, action, (state) => {
                if (action.visitsDetails) {
                    state.visitsDetails = action.visitsDetails || [];
                } else {
                    state.visitsStats = action.visitsStats || {};
                }
            });

        case ActionTypes.ADMIN_BLOG_FETCH_INIT:
        case ActionTypes.ADMIN_BLOG_FETCH_SUCCESS:
        case ActionTypes.ADMIN_BLOG_FETCH_ERROR:
            return fetchReducer(state, action, (state) => {
                state.blogs = action.blogs || [];
            });

        case ActionTypes.ADMIN_BLOG_CHANGE_INIT:
        case ActionTypes.ADMIN_BLOG_CHANGE_SUCCESS:
        case ActionTypes.ADMIN_BLOG_CHANGE_ERROR:
            return mutationReducer(state, action, (state) => {
                state.blogs = addOrReplaceIn(state.blogs, action.blog);
            });

        case ActionTypes.ADMIN_SEO_DATA_FETCH_INIT:
        case ActionTypes.ADMIN_SEO_DATA_FETCH_SUCCESS:
        case ActionTypes.ADMIN_SEO_DATA_FETCH_ERROR:
            return fetchReducer(state, action, (state) => {
                state.seoData = action.seoData || [];
            });

        case ActionTypes.ADMIN_SEO_DATA_CHANGE_INIT:
        case ActionTypes.ADMIN_SEO_DATA_CHANGE_SUCCESS:
        case ActionTypes.ADMIN_SEO_DATA_CHANGE_ERROR:
            return mutationReducer(state, action, (state) => {
                if (action.removedId) {
                    removeIn(state.seoData, action.removedId);
                } else {
                    addOrReplaceIn(state.seoData, action.seoData);
                }
            });

        default:
            return state;
    }
}
