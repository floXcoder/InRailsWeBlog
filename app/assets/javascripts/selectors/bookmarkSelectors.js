'use strict';

import {
    createSelector
} from 'reselect';

export const getBookmarks = createSelector(
    (state) => state.bookmarkState.bookmarks,
    (bookmarks) => bookmarks.toArray()
);

export const getBookmark = createSelector(
    (state) => state.bookmarkState.bookmarks,
    (state) => state.bookmarkState.unbookmarks,
    (_, props) => props.bookmarkedType,
    (_, props) => props.bookmarkedId,
    (bookmarks, unbookmarks, bookmarkedType, bookmarkedId) => {
        const newBookmark = bookmarks.find((bookmark) => bookmark.bookmarkedType && bookmark.bookmarkedType.toLowerCase() === bookmarkedType && bookmarkedType.toLowerCase() && bookmark.bookmarkedId === bookmarkedId);
        const deletedBookmark = !!unbookmarks.find((bookmark) => bookmark.bookmarkedType && bookmark.bookmarkedType.toLowerCase() === bookmarkedType && bookmarkedType.toLowerCase() && bookmark.bookmarkedId === bookmarkedId);

        if (newBookmark) {
            return newBookmark;
        } else if (deletedBookmark) {
            return null;
        } else {
            return null;
        }
    }
);
