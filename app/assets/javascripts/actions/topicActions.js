
import * as ActionTypes from '@js/constants/actionTypes';

import api from '@js/middlewares/api';

// Topics
export const fetchTopics = (userId = null, filter = {}, options = {}, requestOptions = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.get('/api/v1/topics', {
        locale: window.locale,
        userId,
        filter,
        ...options
    }, {
        priorityLow: true,
        ...requestOptions
    })
});

export const fetchTopic = (userId, topicId, options = {}, requestOptions = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.get(options.edit ? `/api/v1/topics/${topicId}/edit` : `/api/v1/topics/${topicId}`, {
        locale: window.locale,
        userId,
        ...options
    }, requestOptions),
    localData: requestOptions.localTopic
});

export const switchTopic = (userId, newTopic, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.get('/api/v1/topics/switch', {
        userId,
        newTopic,
        ...options
    }),
    payload: {
        isSwitching: true
    }
});

// Topic mutations
export const addTopic = (userId, topic, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.post('/api/v1/topics', {
        userId,
        topic,
        ...options
    })
});

export const updateTopic = (userId, topic, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.update(`/api/v1/topics/${topic.id}`, {
        userId,
        topic,
        ...options
    })
});

export const updateTopicInventories = (topicId, inventoryFields) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.post(`/api/v1/topics/${topicId}/inventory_fields`, inventoryFields, true)
});

export const updateTopicPriority = (userId, topicIdsByPriority) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.update('/api/v1/topics/priority', {
        userId,
        topicIds: topicIdsByPriority
    }),
    payload: {
        priority: true
    }
});

export const deleteTopic = (userId, topicId, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.delete(`/api/v1/topics/${topicId}`, {
        userId,
        ...options
    }),
    payload: {
        removedId: topicId
    }
});
