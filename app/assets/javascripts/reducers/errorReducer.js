'use strict';

import {
    Record,
    List,
    fromJS
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import {
    fetchReducer
} from './mutators';

const initState =  new Record({
    // Required for fetchReducer/mutationReducer
    isFetching: false,
    errors: new Map(),

    failures: new List(),
    pagination: new Map()
});

export default function conversationReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.ERROR_FETCH_INIT:
        case ActionTypes.ERROR_FETCH_SUCCESS:
        case ActionTypes.ERROR_FETCH_ERROR:
            return fetchReducer(state, action, (payload) => ({
                failures: fromJS(payload.failures)
            }));

        case ActionTypes.ERROR_DELETE_SUCCESS:
            return state.merge({
                failures: state.failures.filter((failure) => action.removedId !== failure.get('id'))
            });
        case ActionTypes.ERROR_DELETE_ALL_SUCCESS:
            return state.merge({
                failures: new List()
            });

        default:
            return state;
    }
};
