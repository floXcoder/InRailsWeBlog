'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    fetchReducer,
    mutationReducer,
    removeIn,
    addOrReplaceIn
} from './mutators';

const initState = {
    isFetching: false,
    isProcessing: false,
    errors: undefined,

    tags: [],
    pagination: {},

    popularTags: [],

    topicTags: undefined,
    currentTagSlugs: [],

    tag: undefined,

    filterText: undefined
};

export default function tagReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.TAG_FETCH_INIT:
        case ActionTypes.TAG_FETCH_SUCCESS:
        case ActionTypes.TAG_FETCH_ERROR:
            if (action.errors) {
                state.tag = undefined;
                state.tags = [];
            }

            return fetchReducer(state, action, (newState) => {
                if (action.tag) {
                    newState.tag = action.tag;
                } else if (action.topicTags) {
                    newState.topicTags = action.tags || [];
                } else if (action.populars) {
                    newState.popularTags = action.tags || [];
                } else {
                    newState.tags = action.tags || [];
                }
            });

        case ActionTypes.TAG_CHANGE_INIT:
        case ActionTypes.TAG_CHANGE_SUCCESS:
        case ActionTypes.TAG_CHANGE_ERROR:
            return mutationReducer(state, action, (newState) => {
                if (action.tags) {
                    newState.tags = action.tags;
                } else if (action.removedId) {
                    newState.tags = removeIn(newState.tags, action.removedId);
                } else {
                    newState.tag = action.tag;
                    newState.tags = addOrReplaceIn(newState.tags, action.tag);
                }
            });

        case ActionTypes.TAG_FILTER_SIDEBAR:
            state.filterText = action.filterText;
            return state;

        case ActionTypes.TAG_SET_CURRENT_TAGS:
            state.currentTagSlugs = action.tags || [];
            return state;

        default:
            return state;
    }
}
