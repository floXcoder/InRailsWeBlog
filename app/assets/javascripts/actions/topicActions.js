'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Topics
export const fetchTopics = (userId = null, filter = {}, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.get(userId ? `/api/v1/topics` : `/api/v1/topics`, {
        userId,
        filter,
        ...options
    })
});

export const fetchTopic = (userId, topicId, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.get(`/api/v1/topics/${topicId}`, {
        userId,
        ...options
    })
});

export const switchTopic = (userId, newTopicId, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.post(`/api/v1/topics/switch`, {
        userId,
        newTopicId,
        ...options
    }),
    payload: {
        isSwitching: true
    }
});

// Topic mutations
export const addTopic = (userId, topic, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.post(`/api/v1/topics`, {
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
