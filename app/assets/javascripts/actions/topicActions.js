'use strict';

// 'loadTopics',
// 'addTopic',
// 'switchTopic',
// 'updateTopic',
// 'deleteTopic'

import {
    push
} from 'react-router-redux';

import api from '../middleware/api';

import * as ActionTypes from '../constants/actionTypes';

const requestTopic = (topicId) => ({
    type: ActionTypes.FETCH_TOPIC_REQUEST,
    topicId,
    isFetching: true
});

const receiveTopic = (topicId, json) => {
    return ({
        type: ActionTypes.FETCH_TOPIC_SUCCESS,
        topicId,
        isFetching: false,
        topic: json.topic
    });
};

export const fetchTopic = (userId, topicId, params) => (dispatch) => {
    dispatch(requestTopic(topicId));

    return api
        .get(`/users/${userId}/topics/${topicId}`, params)
        .then(json => dispatch(receiveTopic(topicId, json)));
};

export const switchTopic = (userId, newTopicId) => (dispatch) => {
    return api
        .post(`/users/${userId}/topics/switch`, {newTopicId})
        .then(json => dispatch(receiveTopic(newTopicId, json)))
        .then(action => dispatch(push(`/topic/${action.topic.slug}`)))
        .then(dispatch(topicModule((false))));
};
