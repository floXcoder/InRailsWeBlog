'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

import {
    hasLocalStorage,
    saveLocalData
} from '../middlewares/localStorage';

// Bookmarks
const receiveBookmark = (bookmark) => ({
    type: ActionTypes.BOOKMARK_ADD,
    bookmark
});
const deleteBookmark = (bookmark) => ({
    type: ActionTypes.BOOKMARK_DELETE,
    removedBookmarkId: bookmark.bookmarkedId,
    bookmark: bookmark
});
export const bookmark = (bookmarkedType, bookmarkedId, bookmarkId) => (dispatch, getState) => {
    const currentUserId = getState().userState.currentId;
    const bookmark = {
        userId: currentUserId,
        modelType: bookmarkedType,
        modelId: bookmarkedId
    };

    if (!currentUserId) {
        if (bookmarkId) {
            Notification.alert(I18n.t('js.bookmark.notification.not_connected'));
        } else {
            if (hasLocalStorage) {
                saveLocalData('bookmark', {bookmark});
                Notification.alert(I18n.t('js.bookmark.notification.saved_later'), 10, I18n.t('js.bookmark.notification.connection'), () => {
                    window.location = '/login';
                });

                return dispatch(receiveBookmark({bookmark}));
            } else {
                Notification.alert(I18n.t('js.bookmark.notification.not_connected'), 10, I18n.t('js.bookmark.notification.connection'), () => {
                    window.location = '/login';
                });
            }
        }

        return false;
    } else {
        if (!bookmarkId) {
            return api
                .post(`/users/${currentUserId}/bookmarks`, {bookmark})
                .then((response) => {
                    if (response.bookmark) {
                        Notification.alert(I18n.t('js.bookmark.notification.text'), 10, I18n.t('js.bookmark.notification.link'), () => {
                            window.location = `/users/${currentUserId}/bookmarks`;
                        });
                    }

                    return dispatch(receiveBookmark(response.bookmark));
                });
        } else {
            return api
                .delete(`/users/${currentUserId}/bookmarks/${bookmarkId}`, {bookmark})
                .then((response) => dispatch(deleteBookmark(response)));
        }
    }
};
