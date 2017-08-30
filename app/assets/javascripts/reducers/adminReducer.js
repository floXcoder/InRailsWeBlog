'use strict';

import {INIT_ADMIN_SUCCESS} from '../constants/actionTypes';

const initState = {
    currentId: $.isEmpty(window.currentAdminId) ? null : parseInt(window.currentAdminId, 10),
    isFetching: false,
    user: {}
};

export default function adminReducer(state = initState, action) {
    switch (action.type) {
        case INIT_ADMIN_SUCCESS:
            return {
                ...state,
                isFetching: action.isFetching,
                isAdminConnected: !!state.currentId,
                admin: action.user || {}
            };
        default:
            return state;
    }
};
