'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Comments
export const fetchComments = (commentParams) => {
    let url = `/api/v1/${I18n.t('js.comment.common.route')}`;
    let requestParam = {};

    if (commentParams) {
        requestParam = commentParams;

        if (commentParams.commentableType && commentParams.commentableId) {
            url = `/api/v1/${commentParams.commentableType}/${commentParams.commentableId}/comments`;
        } else if (commentParams.commentableId) {
            url = commentParams.commentableId + url;
        } else {
            url = '/api/v1/comments';
        }

        if (commentParams.page) {
            requestParam.page = commentParams.page;
        } else if (commentParams.isPaginated) {
            requestParam.page = 1;
        }
    }

    return ({
        actionType: ActionTypes.COMMENT,
        fetchAPI: () => api.get(url, requestParam)
    });
};

// Comment mutations
export const addComment = (comment, commentableType, commentableId) => {
    const url = `/api/v1/${commentableType}/${commentableId}/comments`;

    return ({
        actionType: ActionTypes.COMMENT,
        mutationAPI: () => api.post(url, {
            comment
        })
    });
};

export const updateComment = (comment, commentableType, commentableId) => {
    const url = `/api/v1/${commentableType}/${commentableId}/comments/${comment.id}`;

    return ({
        actionType: ActionTypes.COMMENT,
        mutationAPI: () => api.update(url, {
            comment
        })
    });
};

export const deleteComment = (commentId, commentableType, commentableId) => {
    const url = `/api/v1/${commentableType}/${commentableId}/comments/${commentId}`;

    return ({
        actionType: ActionTypes.COMMENT,
        mutationAPI: () => api.delete(url, {
            comment: {
                id: commentId
            }
        })
    });
};
