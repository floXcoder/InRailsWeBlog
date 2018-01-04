'use strict';

import {
    createSelector
} from 'reselect';

// User connection
export const getIsOwner = (state, userId) => (
    state.userState.isConnected && state.userState.currentId === userId
);

export const getIsPrimaryUser = () => (
    window.currentUserId === '1'
);

// Users
export const getUsers = createSelector(
    (state) => state.userState.users,
    (users) => users.toArray()
);

export const getUserPagination = createSelector(
    (state) => state.userState.pagination,
    (pagination) => pagination.toJS()
);

export const getUser = createSelector(
    (state) => state.userState.user,
    (user) => user ? user.toJS() : {}
);
