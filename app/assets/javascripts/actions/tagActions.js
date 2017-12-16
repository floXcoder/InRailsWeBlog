'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Tags
export const fetchTags = (filter, options = {}) => ({
    actionType: ActionTypes.TAG,
    fetchAPI: () => api.get(`/tags`, {
        filter,
        ...options
    })
});

export const fetchTag = (tagId, options = {}) => ({
    actionType: ActionTypes.TAG,
    fetchAPI: () => api.get(`/tags/${tagId}`, {
        ...options
    })
});
