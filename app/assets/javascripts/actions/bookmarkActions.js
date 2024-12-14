import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

import * as ActionTypes from '@js/constants/actionTypes';

import api from '@js/middlewares/api';

import {
    hasLocalStorage,
    saveLocalArray,
    getAllData
} from '@js/middlewares/localStorage';

import Notification from '@js/modules/notification';


// Bookmarks
export const fetchBookmarks = (userId, options = {}, payload = {}) => ({
    actionType: ActionTypes.BOOKMARK,
    fetchAPI: () => api.get(`/api/v1/users/${userId}/bookmarks`, {
        locale: window.locale,
        ...options
    }, {
        priorityLow: true
    }),
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
    currentUserId ||= getState().userState.currentId;
    const currentUserTopicId = getState().topicState.currentUserTopicId;

    const bookmarkParams = {
        userId: currentUserId,
        bookmarkedType,
        bookmarkedId
    };

    if (currentUserTopicId) {
        bookmarkParams.topicId = currentUserTopicId;
    }

    if (!currentUserId) {
        if (bookmarkData) {
            Notification.alert(I18n.t('js.bookmark.notification.not_connected'));
        } else if (hasLocalStorage) {
            saveLocalArray('bookmark', {bookmark: bookmarkParams});
            Notification.alert(I18n.t('js.bookmark.notification.saved_later'));

            return dispatch(receiveBookmark({bookmark: bookmarkParams}));
        } else {
            Notification.alert(I18n.t('js.bookmark.notification.not_connected'));
        }

        return false;
    } else if (!bookmarkData) {
        return api
            .post(`/api/v1/users/${currentUserId}/bookmarks`, {bookmark: bookmarkParams})
            .then((response) => {
                if (!bookmarkData && !response.errors) {
                    Notification.alert(I18n.t('js.bookmark.notification.text'));
                }

                return dispatch(receiveBookmark({bookmark: response.data.attributes}));
            });
    } else {
        return api
            .delete(`/api/v1/users/${currentUserId}/bookmarks/${bookmarkData.id}`, {bookmark: bookmarkParams})
            .then(() => dispatch(deleteBookmark(bookmarkData)));
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
            dataParams.forEach((bookmarkParams) => {
                dispatch(bookmark(bookmarkParams.bookmarkedType, bookmarkParams.bookmarkedId, bookmarkParams.isRemoving));
            });
        }
    });
};
