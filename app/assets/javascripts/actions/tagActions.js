'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Tags
export const fetchTags = (filter, options = {}, payload = {}) => ({
    actionType: ActionTypes.TAG,
    fetchAPI: () => api.get(`/api/v1/tags`, {
        filter,
        ...options
    }),
    shouldCallAPI: (state) => {
        return !state.userState.isConnected ? state.tagState.tags.size === 0 : true;
    },
    payload
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

// Tag mutations
export const addTag = (tag, options = {}) => ({
    actionType: ActionTypes.TAG,
    mutationAPI: () => api.post(`/api/v1/tags`, {
        tag,
        ...options
    })
});

// export const inlineEditTag = (tagId) => ({
//     type: ActionTypes.TAG_EDITION,
//     tagId
// });

export const updateTag = (tag, options = {}) => ({
    actionType: ActionTypes.TAG,
    mutationAPI: () => api.update(`/api/v1/tags/${tag.id}`, {
        tag,
        ...options
    })
});

// export const updateTagPriority = (tagIdsByPriority) => ({
//     actionType: ActionTypes.TAG,
//     mutationAPI: () => api.update(`/api/v1/tags/priority`, {
//         tagIds: tagIdsByPriority
//     })
// });

export const deleteTag = (tagId, options = {}) => ({
    actionType: ActionTypes.TAG,
    mutationAPI: () => api.delete(`/api/v1/tags/${tagId}`, {
        ...options
    }),
    payload: {
        removedId: tagId
    }
});

export const setCurrentTags = (tags) => ({
    type: ActionTypes.TAG_SET_CURRENT_TAGS,
    tags
});
