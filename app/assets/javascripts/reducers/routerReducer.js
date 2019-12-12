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
            let {['0']: topicType, ...routeParams} = action.params;
            if (topicType === 'shared-topics') {
                routeParams.sharedTopic = true;
            }

            state.currentRoute = action.currentRoute;
            state.params = routeParams;
            state.location = action.location;
            return state;

        default:
            return state;
    }
};
