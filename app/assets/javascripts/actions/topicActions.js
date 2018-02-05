'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Topics
export const fetchTopics = (userId = null, filter = {}, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.get(userId ? `/topics` : `/topics`, {
        userId,
        filter,
        ...options
    })
});

export const fetchTopic = (userId, topicId, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.get(`/topics/${topicId}`, {
        userId,
        ...options
    })
});

export const switchTopic = (userId, newTopicId, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.post(`/topics/switch`, {
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
    mutationAPI: () => api.post(`/topics`, {
        userId,
        topic,
        ...options
    })
});

export const updateTopic = (userId, topic, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.update(`/topics/${topic.id}`, {
        userId,
        topic,
        ...options
    })
});

export const deleteTopic = (userId, topicId, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.delete(`/topics/${topicId}`, {
        userId,
        ...options
    }),
    payload: {
        removedId: topicId
    }
});
