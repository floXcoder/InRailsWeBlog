'use strict';

import {
    withScope as SentryWithScope,
    captureException as SentryCaptureException
} from '@sentry/browser';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

export const pushError = (error, errorInfo = null) => {
    if (!error) {
        return;
    }

    if (window.SENTRY_JAVASCRIPT_KEY) {
        SentryWithScope((scope) => {
            scope.setExtras(errorInfo);
            SentryCaptureException(error);
        });
    }

    // return api
    //     .post(`/errors`, {
    //         error: {
    //             message: error.message,
    //             className: error.url,
    //             trace: error.trace,
    //             origin: error.origin,
    //             targetUrl: error.url,
    //             lineNumber: error.lineNumber,
    //             columnNumber: error.columnNumber
    //         }
    //     });
};

// Error
export const fetchErrors = (errorParams) => ({
    actionType: ActionTypes.ERROR,
    fetchAPI: () => api.get(`/errors`, errorParams)
});

// Error mutation
const removeError = (errorId) => ({
    type: ActionTypes.ERROR_DELETE_SUCCESS,
    removedId: errorId
});
export const deleteError = (errorId) => (dispatch) => {
    return api
        .delete(`/errors/${errorId}`)
        .then(() => dispatch(removeError(errorId)));
};

const removeErrors = (json) => ({
    type: ActionTypes.ERROR_DELETE_ALL_SUCCESS,
    removedIds: json
});
export const deleteAllErrors = () => (dispatch) => {
    return api
        .delete(`/errors/delete_all`)
        .then((json) => dispatch(removeErrors(json)));
};
