'use strict';

import {
    Record,
    Map,
    List
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
    isFetching: false,
    isProcessing: false,
    errors: new Map(),

    tags: new List(),
    pagination: new Map(),

    tag: undefined,

    filterText: undefined
});

export default function tagReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.TAG_FETCH_INIT:
        case ActionTypes.TAG_FETCH_SUCCESS:
        case ActionTypes.TAG_FETCH_ERROR:
            return fetchReducer(state, action, (payload) =>
                payload.tag ? ({
                    tag: new Records.TagRecord(payload.tag)
                }) : ({
                    tags: toList(payload.tags, Records.TagRecord)
                })
            );

        case ActionTypes.TAG_CHANGE_INIT:
        case ActionTypes.TAG_CHANGE_SUCCESS:
        case ActionTypes.TAG_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) =>
                payload.tags ? ({
                    tags: toList(payload.tags, Records.TagRecord)
                }) : ({
                    tags: mutateArray(state.tags, payload.tag && new Records.TagRecord(payload.tag), action.removedId)
                }), ['tag']);

        case ActionTypes.TAG_FILTER_SIDEBAR:
            return state.merge({
                filterText: action.filterText
            });

        default:
            return state;
    }
};
