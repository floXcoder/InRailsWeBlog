'use strict';

import {
    Record
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

const initState = new Record({
    currentId: window.currentAdminId ? parseInt(window.currentAdminId, 10) : undefined,
    isConnected: !!window.currentAdminId,

    admin: undefined,

    errors: undefined
});

export default function adminReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.ADMIN_FETCH_SUCCESS:
            return state.merge({
                admin: new Records.UserRecord(action.user)
            });

        case ActionTypes.ADMIN_SETTINGS_CHANGE_ERROR:
            return state.merge({
                errors: action.errors
            });

        default:
            return state;
    }
};
