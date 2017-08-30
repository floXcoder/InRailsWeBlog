'use strict';

// 'loadUsers',
// 'validation',
// 'loadUserComments',
// 'loadUserActivities',
// 'loadUser',
// 'updateUser',
// 'updateUserPreference',
// 'trackClick',
// 'trackView'

import api from '../middleware/api';

import * as ActionTypes from '../constants/actionTypes';

const requestUser = (userId) => ({
    type: ActionTypes.FETCH_USER_REQUEST,
    userId,
    isFetching: true
});

const receiveUser = (userId, json) => ({
    type: ActionTypes.FETCH_USER_SUCCESS,
    userId,
    isFetching: false,
    user: json.user
});

const initUser = (userId, json) => ({
    type: ActionTypes.INIT_USER_SUCCESS,
    userId,
    isFetching: false,
    user: json.user
});

export const fetchUsers = (userId, params) => (dispatch) => {
    dispatch(requestUser(userId));

    return api
        .get(`/users/${userId}`, params)
        .then(json => {
                if (params && params.userProfile) {
                    dispatch(initUser(userId, json));
                    // TODO: just replace current url or push but not switch
                    // dispatch(switchTopic(json.user.currentTopic.slug));
                } else {
                    dispatch(receiveUser(userId, json));
                }
            }
        );
};
