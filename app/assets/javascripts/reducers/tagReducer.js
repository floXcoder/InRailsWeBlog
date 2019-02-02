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
    metaTags: new Map(),
    pagination: new Map(),

    popularTags: new List(),

    topicTags: new List(),
    currentTagSlugs: new List(),

    tag: undefined,

    filterText: undefined
});

export default function tagReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.TAG_FETCH_INIT:
        case ActionTypes.TAG_FETCH_SUCCESS:
        case ActionTypes.TAG_FETCH_ERROR:
            return fetchReducer(state, action, (payload) => {
                if (payload.tag) {
                    return {
                        tag: new Records.TagRecord(payload.tag)
                    };
                } else {
                    if (payload.topicTags) {
                        return {
                            topicTags: toList(payload.tags, Records.TagRecord)
                        };
                    } else if (payload.populars) {
                        return {
                            popularTags: toList(payload.tags, Records.TagRecord)
                        };
                    } else {
                        return {
                            tags: toList(payload.tags, Records.TagRecord)
                        };
                    }
                }
            }, ['tags', 'topicTags', 'populars']);

        case ActionTypes.TAG_CHANGE_INIT:
        case ActionTypes.TAG_CHANGE_SUCCESS:
        case ActionTypes.TAG_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) =>
                payload.tags ? ({
                    tags: toList(payload.tags, Records.TagRecord)
                }) : ({
                    tag: payload.tag && (new Records.TagRecord(payload.tag)),
                    tags: mutateArray(state.tags, payload.tag && (new Records.TagRecord(payload.tag)), action.removedId)
                })/*, ['tag']*/);

        case ActionTypes.TAG_FILTER_SIDEBAR:
            return state.merge({
                filterText: action.filterText
            });

        case ActionTypes.TAG_SET_CURRENT_TAGS:
            return state.merge({
                currentTagSlugs: new List(action.tags)
            });

        default:
            return state;
    }
};
