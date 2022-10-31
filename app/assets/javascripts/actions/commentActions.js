'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Comments
export const fetchComments = (commentParams, requestOptions = {}) => {
    let url = `/api/v1/${I18n.t('js.comment.common.route')}`;
    let params = {};

    if (commentParams) {
        params = commentParams;

        if (commentParams.commentableType && commentParams.commentableId) {
            url = `/api/v1/${commentParams.commentableType}/${commentParams.commentableId}/comments`;
        } else if (commentParams.commentableId) {
            url = commentParams.commentableId + url;
        } else {
            url = '/api/v1/comments';
        }

        if (commentParams.limit) {
            params.limit = commentParams.limit;
        } else if (commentParams.page) {
            params.page = commentParams.page;
        } else if (commentParams.isPaginated) {
            params.page = 1;
        }

        if (commentParams.order) {
            params.filter = {
                order: commentParams.order
            };
        }
    }

    return ({
        actionType: ActionTypes.COMMENT,
        fetchAPI: () => api.get(url, params, {
            priorityLow: true,
            ...requestOptions
        })
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
    const url = `/api/v1/${commentableType}/${commentableId}/comments`;

    return ({
        actionType: ActionTypes.COMMENT,
        mutationAPI: () => api.update(url, {
            comment
        })
    });
};

export const deleteComment = (commentId, commentableType, commentableId) => {
    const url = `/api/v1/${commentableType}/${commentableId}/comments`;

    return ({
        actionType: ActionTypes.COMMENT,
        mutationAPI: () => api.delete(url, {
            comment: {
                id: commentId
            }
        })
    });
};
