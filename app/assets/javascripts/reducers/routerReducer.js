'use strict';

import {
    Record,
    Map
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

const initState = new Record({
    currentRoute: new Map,

    params: new Map,

    location: new Map
});

export default function routeReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.ROUTER_ROUTE_CHANGE:
            let {['0']: topicType, ...routeParams} = action.params;
            if (topicType === 'shared-topics') {
                routeParams.sharedTopic = true;
            }

            return state.merge({
                currentRoute: new Map(action.currentRoute),
                params: new Map(routeParams),
                location: new Map(action.location)
            });

        default:
            return state;
    }
};
