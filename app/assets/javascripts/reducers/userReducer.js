'use strict';

import {INIT_USER_SUCCESS, FETCH_USER_REQUEST, FETCH_USER_SUCCESS, FETCH_USER_FAILED} from '../constants/actionTypes';

const initState = {
    currentId: $.isEmpty(window.currentUserId) ? null : parseInt(window.currentUserId, 10),
    isUserConnected: !$.isEmpty(window.currentUserId),
    isFetching: false,
    user: {}
};

export const isOwner = (state) => state.currentId === 1;

export const isValidUser = (state, userId) => userId ? userId === state.currentId : false;

export default function userReducer(state = initState, action) {
    switch (action.type) {
        case FETCH_USER_REQUEST:
            return {
                ...state,
                isFetching: action.isFetching,
                user: action.user || {}
            };
        case INIT_USER_SUCCESS:
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                isFetching: action.isFetching,
                isUserConnected: !!state.currentId,
                user: action.user
            };
        case FETCH_USER_FAILED:
            return {
                ...state,
                isFetching: false,
                user: {}
            };
        default:
            return state;
    }
};
