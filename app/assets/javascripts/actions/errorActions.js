'use strict';

import {
    withScope as SentryWithScope,
    captureMessage as SentrycaptureMessage
} from '@sentry/browser';

export const pushError = (error, errorInfo = null) => {
    if (!error) {
        return;
    }

    if (window.SENTRY_JAVASCRIPT_KEY) {
        SentryWithScope((scope) => {
            scope.setExtras(errorInfo);
            SentrycaptureMessage(`error.statusText (${error.status} : ${error.url})`);
        });
    }
};
