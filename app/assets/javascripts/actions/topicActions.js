'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// TODO
// 'loadTopics',
// 'addTopic',
// 'switchTopic',
// 'updateTopic',
// 'deleteTopic'

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
