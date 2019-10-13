'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Admins
export const logoutAdmin = () => (
    api.delete('/admins/logout')
);

// Meta search
const initSearch = () => ({
    type: ActionTypes.ADMIN_META_SEARCH_INIT,
    isSearching: true
});
const receiveMetaSearch = (query, json) => ({
    type: ActionTypes.ADMIN_META_SEARCH_SUCCESS,
    isSearching: false,
    metaQuery: query,
    metaResults: json
});

export const fetchMetaSearch = (query, options= {}) => (dispatch) => {
    dispatch(initSearch());

    return api
        .post('/api/v1/search/meta', {
            search: {
                query,
                ...options
            }
        })
        .then((json) => dispatch(receiveMetaSearch(query, json)));
};

// Blogs
export const fetchBlogs = (filter, options = {}) => ({
    actionType: ActionTypes.ADMIN_BLOG,
    fetchAPI: () => api.get('/admins/blogs', {
        filter,
        ...options
    })
});

export const addBlog = (blogData) => ({
    actionType: ActionTypes.ADMIN_BLOG,
    mutationAPI: () => api.post('/admins/blogs', blogData, true)
});

export const updateBlog = (blogId, blogData) => ({
    actionType: ActionTypes.ADMIN_BLOG,
    mutationAPI: () => api.update(`/admins/blogs/${blogId}`, blogData, true)
});

// Logs
export const fetchLogs = (data) => () => (
    api.post('/admins/logs/stream', {
        logs: data
    })
);

// Cache
export const flushCache = () => () => (
    api.post('/admins/caches/flush_cache')
);
