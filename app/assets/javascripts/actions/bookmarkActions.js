'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

import {
    hasLocalStorage,
    saveLocalData,
    getAllData
} from '../middlewares/localStorage';

// Bookmarks
export const fetchBookmarks = (userId, options = {}, payload = {}) => ({
    actionType: ActionTypes.BOOKMARK,
    fetchAPI: () => api.get(`/api/v1/users/${userId}/bookmarks`, options),
    payload
});

// Bookmark mutation
const receiveBookmark = (json) => ({
    type: ActionTypes.BOOKMARK_ADD,
    bookmark: json.bookmark
});
const deleteBookmark = (bookmark) => ({
    type: ActionTypes.BOOKMARK_DELETE,
    removedBookmarkedId: bookmark.bookmarkedId,
    bookmark: bookmark
});

export const bookmark = (bookmarkedType, bookmarkedId, bookmarkData, currentUserId = null) => (dispatch, getState) => {
    currentUserId = currentUserId || getState().userState.currentId;
    const currentUserTopicId = getState().topicState.currentUserTopicId;

    const bookmark = {
        userId: currentUserId,
        bookmarkedType,
        bookmarkedId
    };

    if (currentUserTopicId) {
        bookmark.topicId = currentUserTopicId;
    }

    if (!currentUserId) {
        if (bookmarkData) {
            Notification.alert(I18n.t('js.bookmark.notification.not_connected'));
        } else {
            if (hasLocalStorage) {
                saveLocalData('bookmark', {bookmark});
                Notification.alert(I18n.t('js.bookmark.notification.saved_later'), I18n.t('js.bookmark.notification.connection'), () => {
                    window.location = '/login';
                });

                return dispatch(receiveBookmark({bookmark}));
            } else {
                Notification.alert(I18n.t('js.bookmark.notification.not_connected'), I18n.t('js.bookmark.notification.connection'), () => {
                    window.location = '/login';
                });
            }
        }

        return false;
    } else {
        if (!bookmarkData) {
            return api
                .post(`/api/v1/users/${currentUserId}/bookmarks`, {bookmark})
                .then((response) => {
                    if (!bookmarkData && !response.errors) {
                        Notification.alert(I18n.t('js.bookmark.notification.text'));
                    }

                    return dispatch(receiveBookmark(response));
                });
        } else {
            return api
                .delete(`/api/v1/users/${currentUserId}/bookmarks/${bookmarkData.id}`, {bookmark})
                .then(() => dispatch(deleteBookmark(bookmarkData)));
        }
    }
};

// Synchronize
export const synchronizeBookmarks = () => (dispatch) => {
    const pendingData = getAllData();

    if (Utils.isEmpty(pendingData)) {
        return;
    }

    Object.keys(pendingData).forEach((dataName) => {
        const dataParams = pendingData[dataName];
        if (dataName === 'bookmark') {
            dataParams.map((bookmarkParams) => {
                dispatch(bookmark(bookmarkParams.bookmarkedType, bookmarkParams.bookmarkedId, bookmarkParams.isRemoving));
            });
        }
    });
};
