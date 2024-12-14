
import * as ActionTypes from '@js/constants/actionTypes';

import api from '@js/middlewares/api';

// Users
export const fetchUsers = (filter, options = {}, requestOptions = {}) => ({
    actionType: ActionTypes.USER,
    fetchAPI: () => api.get('/api/v1/users', {
        locale: window.locale,
        filter,
        ...options
    }, requestOptions)
});

export const fetchUser = (userId, options = {}, requestOptions = {}) => ({
    actionType: ActionTypes.USER,
    fetchAPI: () => api.get(`/api/v1/users/${userId}`, {
        locale: window.locale,
        ...options
    }, requestOptions)
});

export const initUser = (userId, options = {}, requestOptions = {}) => ({
    actionType: ActionTypes.USER,
    fetchAPI: () => api.get(`/api/v1/users/${userId}`, {
        locale: window.locale,
        ...options
    }, requestOptions),
    shouldCallAPI: (state) => {
        return !state.userState.user;
    },
    localData: requestOptions.localUser,
    payload: {
        connection: true
    }
});

export const validateUser = (validationParam) => (
    api.get('/api/v1/users/validation', {
        user: validationParam
    }).request
);

export const logoutUser = () => (
    api.delete('/api/v1/logout')
);

// User mutations
export const signupUser = (user, options = {}) => ({
    actionType: ActionTypes.USER,
    mutationAPI: () => api.post('/api/v1/signup', {
        user,
        ...options
    }),
    payload: {
        connection: true
    }
});

export const loginUser = (user, options = {}) => ({
    actionType: ActionTypes.USER,
    mutationAPI: () => api.post('/api/v1/login', {
        user,
        ...options
    }),
    payload: {
        connection: true
    }
});

export const updateUserSettings = (userId, settings, options = {}) => ({
    actionType: ActionTypes.USER,
    mutationAPI: () => api.post(`/api/v1/users/${userId}/settings`, {
        settings,
        ...options
    }),
    payload: {
        settings: true
    }
});

// User recent events
const receiveUserRecents = (json) => ({
    type: ActionTypes.USER_RECENTS,
    topics: json?.topics || [],
    tags: json?.tags || [],
    articles: json?.articles || [],
    updatedArticles: json?.updatedArticles || []
});
export const fetchUserRecents = (userId, options = {}, payload = {}) => (dispatch, getState) => {
    if (!getState().userState.recentArticles.length || payload.forceRefresh) {
        return api
            .get(userId ? `/api/v1/users/${userId}/recents` : '/api/v1/users/recents', options, {
                priorityLow: true
            })
            .request
            .then((json) => dispatch(receiveUserRecents(json)));
    } else {
        return Promise.resolve();
    }
};

// // Export user data
// export const exportUserData = (userId) => (
//     api.get('/api/v1/exporter.zip', {
//         userId
//     }).request
// );
