'use strict';

import {
    withScope as SentryWithScope,
    captureException as SentryCaptureException
} from '@sentry/browser';

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
};
