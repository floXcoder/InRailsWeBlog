'use strict';

import {
    Record,
    Map,
    List
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

import {
    fetchReducer,
    toList,
    mutateArray
} from './mutators';

const initState = new Record({
    isFetching: false,
    isProcessing: false,
    errors: new Map(),
    metaTags: new Map(),
    pagination: new Map(),

    bookmarks: new List(),
    unbookmarks: new List()
});

export default function bookmarkReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.BOOKMARK_FETCH_INIT:
        case ActionTypes.BOOKMARK_FETCH_SUCCESS:
        case ActionTypes.BOOKMARK_FETCH_ERROR:
            return fetchReducer(state, action, (payload) => ({
                bookmarks: toList(payload.bookmarks, Records.BookmarkRecord)
            }));

        case ActionTypes.BOOKMARK_ADD:
            return state.merge({
                bookmarks: mutateArray(state.bookmarks, action.bookmark, null, 'bookmarkedId')
            });
        case ActionTypes.BOOKMARK_DELETE:
            return state.merge({
                bookmarks: mutateArray(state.bookmarks, action.bookmark, action.removedBookmarkedId, 'bookmarkedId'),
                unbookmarks: state.bookmarks.concat([action.bookmark])
            });

        default:
            return state;
    }
};
