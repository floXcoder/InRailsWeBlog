'use strict';

import {
    Record,
    List
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import {
    mutateArray
} from './mutators';

const initState = new Record({
    bookmarks: new List(),
    unbookmarks: new List()
});

export default function bookmarkReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.BOOKMARK_ADD:
            return state.merge({
                bookmarks: mutateArray(state.bookmarks, action.bookmark, null, 'bookmarkedId')
            });
        case ActionTypes.BOOKMARK_DELETE:
            return state.merge({
                bookmarks: mutateArray(state.bookmarks, action.bookmark, action.removedBookmarkId, 'bookmarkedId'),
                unbookmarks: state.bookmarks.concat([action.bookmark])
            });

        default:
            return state;
    }
};
