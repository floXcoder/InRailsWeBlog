'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    fetchReducer,
    addOrReplaceIn,
    removeIn
} from './mutators';

const initState = {
    isFetching: false,
    isProcessing: false,
    errors: {},

    pagination: {},

    bookmarks: [],
    unbookmarks: []
};

export default function bookmarkReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.BOOKMARK_FETCH_INIT:
        case ActionTypes.BOOKMARK_FETCH_SUCCESS:
        case ActionTypes.BOOKMARK_FETCH_ERROR:
            return fetchReducer(state, action, (state) => {
                state.bookmarks = action.bookmarks || [];
            });

        case ActionTypes.BOOKMARK_ADD:
            state.bookmarks = addOrReplaceIn(state.bookmarks, action.bookmark, 'bookmarkedId');
            return state;
        case ActionTypes.BOOKMARK_DELETE:
            state.bookmarks = removeIn(state.bookmarks, action.removedBookmarkedId, 'bookmarkedId');
            state.unbookmarks = state.bookmarks.concat([action.bookmark]);
            return state;

        default:
            return state;
    }
};
