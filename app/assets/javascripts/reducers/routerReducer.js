'use strict';

import * as ActionTypes from '../constants/actionTypes';

const initState = {
    currentRoute: {},

    params: {},

    location: {}
};

export default function routeReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.ROUTER_ROUTE_CHANGE:
            state.currentRoute = action.currentRoute;
            state.params = action.params;
            state.location = action.location;
            return state;

        default:
            return state;
    }
};
