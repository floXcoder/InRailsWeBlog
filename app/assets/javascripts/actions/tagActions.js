
import * as ActionTypes from '@js/constants/actionTypes';

import api from '@js/middlewares/api';

// Tags
export const fetchTags = (filter = {}, options = {}, payload = {}, requestOptions = {}) => ({
    actionType: ActionTypes.TAG,
    fetchAPI: () => api.get('/api/v1/tags', {
        locale: window.locale,
        filter,
        ...options
    }, {
        ...requestOptions,
        priorityLow: true
    }),
    shouldCallAPI: (state) => {
        return !state.userState.isConnected && payload.topicTags ? state.tagState.topicTags.length === 0 : true;
    },
    payload
});

export const fetchTag = (tagId, options = {}, requestOptions = {}) => ({
    actionType: ActionTypes.TAG,
    fetchAPI: () => api.get(options.edit ? `/api/v1/tags/${tagId}/edit` : `/api/v1/tags/${tagId}`, {
        locale: window.locale,
        ...options
    }, requestOptions),
    localData: requestOptions.localTag
});

export const filterTags = (filterText) => ({
    type: ActionTypes.TAG_FILTER_SIDEBAR,
    filterText
});

// Tag mutations
export const addTag = (tag, options = {}) => ({
    actionType: ActionTypes.TAG,
    mutationAPI: () => api.post('/api/v1/tags', {
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

export const updateTagPriority = (tagIdsByPriority) => ({
    actionType: ActionTypes.TAG,
    mutationAPI: () => api.update('/api/v1/tags/priority', {
        tagIds: tagIdsByPriority
    })
});

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
