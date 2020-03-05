'use strict';

import {
    withScope as SentryWithScope,
    captureException as SentryCaptureException,
    captureMessage as SentryCaptureMessage
} from '@sentry/browser';

export const pushError = (error, errorInfo = null) => {
    if (!error) {
        return;
    }

    if (window.SENTRY_JAVASCRIPT_KEY) {
        SentryWithScope((scope) => {
            if (error instanceof Error) {
                scope.setExtras(errorInfo);
                SentryCaptureException(error);
            } else {
                errorInfo = {url: error.url, ...(errorInfo || {})};
                scope.setExtras(errorInfo);
                const errorMessage = [error.statusText, error.status].filter((err) => !!err);
                SentryCaptureMessage(errorMessage.join(', '));
            }
        });
    } else if (process.env.NODE_ENV !== 'test') {
        console.error(error, errorInfo);
    }
};
