'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// TODO
// 'loadUsers',
// 'loadUserComments',
// 'loadUserActivities',
// 'loadUser',
// 'updateUser',
// 'updateUserPreference',

// Users
export const fetchUsers = (filter, options = {}) => ({
    actionType: ActionTypes.USER,
    fetchAPI: () => api.get(`/users`, {
        filter,
        ...options
    })
});

export const fetchUser = (userId, options = {}) => ({
    actionType: ActionTypes.USER,
    fetchAPI: () => api.get(`/users/${userId}`, {
        ...options
    })
});

export const validateUser = (pseudo) => (
    api.get('/users/validation', {
        user: {
            pseudo: pseudo
        }
    })
);

// User mutations
export const signupUser = (user, options = {}) => ({
    actionType: ActionTypes.USER,
    mutationAPI: () => api.post(`/users`, {
        user,
        ...options
    }),
    payload: {
        connection: true
    }
});

export const loginUser = (user, options = {}) => ({
    actionType: ActionTypes.USER,
    mutationAPI: () => api.post(`/login`, {
        user,
        ...options
    }),
    payload: {
        connection: true
    }
});

// TODO
// if (params && params.userProfile) {
//     dispatch(initUser(userId, json));
//     // TODO: just replace current url or push but not switch
//     // dispatch(switchTopic(json.user.currentTopic.slug));
// } else {
//     dispatch(receiveUser(userId, json));
// }
