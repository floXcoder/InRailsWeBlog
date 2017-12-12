'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// TODO
// 'loadUsers',
// 'validation',
// 'loadUserComments',
// 'loadUserActivities',
// 'loadUser',
// 'updateUser',
// 'updateUserPreference',
// 'trackClick',
// 'trackView'

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
// TODO
// if (params && params.userProfile) {
//     dispatch(initUser(userId, json));
//     // TODO: just replace current url or push but not switch
//     // dispatch(switchTopic(json.user.currentTopic.slug));
// } else {
//     dispatch(receiveUser(userId, json));
// }
