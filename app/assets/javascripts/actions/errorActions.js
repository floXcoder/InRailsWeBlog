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
            scope.setExtras(errorInfo);
            if(error instanceof Error) {
                SentryCaptureException(error);
            } else {
                SentryCaptureMessage(`${error.statusText} (${error.status} : ${error.url})`);
            }
        });
    }
};
