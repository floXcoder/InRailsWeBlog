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

// Visits
export const fetchVisits = (filter = {}, options = {}) => ({
    actionType: ActionTypes.ADMIN_VISIT,
    fetchAPI: () => api.get('/admins/visits', {
        filter,
        ...options
    })
});

// Blogs
export const fetchBlogs = (filter = {}, options = {}) => ({
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

// SEO Data
export const fetchSeoData = (filter, options = {}) => ({
    actionType: ActionTypes.ADMIN_SEO_DATA,
    fetchAPI: () => api.get('/admins/seo', {
        filter,
        ...options
    })
});

export const retrieveParametersSeoData = (urlOrRoute) => () => (
    api.post('/admins/seo/retrieve_parameters', {
        ...urlOrRoute
    })
);

export const addSeoData = (seoData) => ({
    actionType: ActionTypes.ADMIN_SEO_DATA,
    mutationAPI: () => api.post('/admins/seo', seoData, true)
});

export const updateSeoData = (seoDataId, seoData) => ({
    actionType: ActionTypes.ADMIN_SEO_DATA,
    mutationAPI: () => api.update(`/admins/seo/${seoDataId}`, seoData, true)
});

export const deleteSeoData = (seoDataId, options = {}) => ({
    actionType: ActionTypes.ADMIN_SEO_DATA,
    mutationAPI: () => api.delete(`/admins/seo/${seoDataId}`, {
        ...options
    }),
    payload: {
        removedId: seoDataId
    }
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
