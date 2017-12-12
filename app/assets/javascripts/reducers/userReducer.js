'use strict';

import {
    Record,
    Map,
    List,
    fromJS
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

import {
    toList,
    fetchReducer,
    mutationReducer,
    mutateArray
} from './mutators';

const initState = new Record({
    // Required for fetchReducer/mutationReducer
    isFetching: false,
    isProcessing: false,
    errors: new Map(),

    currentId: window.currentUserId ? parseInt(window.currentUserId, 10) : undefined,
    isConnected: !!window.currentUserId,

    user: undefined,

    users: new List(),
    pagination: new Map(),

    comments: new List(),
    commentPagination: new Map(),
});

// TODO
// export const isOwner = (state) => state.currentId === 1;
//
// export const isValidUser = (state, userId) => userId ? userId === state.currentId : false;

export default function userReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.USER_FETCH_INIT:
        case ActionTypes.USER_FETCH_SUCCESS:
        case ActionTypes.USER_FETCH_ERROR:
            return fetchReducer(state, action, (payload) =>
                payload.user ? ({
                    user: new Records.UserRecord(payload.user)
                }) : ({
                    users: toList(payload.users, Records.UserRecord)
                })
            );

        case ActionTypes.USER_CHANGE_INIT:
        case ActionTypes.USER_CHANGE_SUCCESS:
        case ActionTypes.USER_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) => ({
                user: payload.user ? new Records.UserRecord(payload.user) : undefined
            }));

        default:
            return state;
    }
};
