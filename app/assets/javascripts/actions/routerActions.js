'use strict';

import * as ActionTypes from '../constants/actionTypes';

// Users
export const routeChange = (currentRoute, params, location) => ({
    type: ActionTypes.ROUTER_ROUTE_CHANGE,
    currentRoute,
    params,
    location
});
