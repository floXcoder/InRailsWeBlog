'use strict';

import {
    createSelector
} from 'reselect';

export const getIsBookmarked = createSelector(
    (state) => state.bookmarkState.bookmarks,
    (state) => state.bookmarkState.unbookmarks,
    (_, props) => props.bookmarkType,
    (_, props) => props.bookmarkId,
    (_, props) => !!props.bookmarkedId,
    (bookmarks, unbookmarks, bookmarkType, bookmarkId, wasBookmarked) => {
        const isNew = !!bookmarks.find((bookmark) => (bookmark.bookmarkedType && bookmark.bookmarkedType.toLowerCase()) === (bookmarkType && bookmarkType.toLowerCase()) && bookmark.bookmarkedId === bookmarkId);
        const isDeleted = !!unbookmarks.find((bookmark) => (bookmark.bookmarkedType && bookmark.bookmarkedType.toLowerCase()) === (bookmarkType && bookmarkType.toLowerCase()) && bookmark.bookmarkedId === bookmarkId);

        if (isNew) {
            return true
        } else if (isDeleted) {
            return false;
        } else {
            return wasBookmarked;
        }
    }
);
