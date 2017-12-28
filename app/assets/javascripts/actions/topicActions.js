'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Topics
export const fetchTopics = (filter, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.get(`/topics`, {
        filter,
        ...options
    })
});

export const fetchTopic = (userId, topicId, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.get(`/users/${userId}/topics/${topicId}`, {
        ...options
    })
});

export const switchTopic = (userId, topicId, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    fetchAPI: () => api.get(`/users/${userId}/topics/${topicId}`, {
        ...options
    })
    // TODO
// .then(action => dispatch(push(`/topic/${action.topic.slug}`)))
// .then(dispatch(topicModule((false))));
});

// Topic mutations
export const addTopic = (topic, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.post(`/topics`, {
        topic,
        ...options
    })
});

export const updateTopic = (topic, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.update(`/topics/${topic.id}`, {
        topic,
        ...options
    })
});

export const deleteTopic = (topicId, options = {}) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.delete(`/topics/${topicId}`, {
        ...options
    }),
    payload: {
        removedId: topicId
    }
});
