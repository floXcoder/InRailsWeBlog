'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Tags
export const fetchTags = (filter, options = {}) => ({
    actionType: ActionTypes.TAG,
    fetchAPI: () => api.get(`/api/v1/tags`, {
        filter,
        ...options
    })
});

export const fetchTag = (tagId, options = {}) => ({
    actionType: ActionTypes.TAG,
    fetchAPI: () => api.get(`/api/v1/tags/${tagId}`, {
        ...options
    })
});

export const filterTags = (filterText) => ({
    type: ActionTypes.TAG_FILTER_SIDEBAR,
    filterText
});
