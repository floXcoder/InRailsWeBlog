'use strict';

import {
    init as SentryInit,
    configureScope as SentryConfigureScope,
    withScope as SentryWithScope,
    captureException as SentryCaptureException,
    captureMessage as SentryCaptureMessage
    // showReportDialog as SentryShowReportDialog
} from '@sentry/browser';
// import {
//     BrowserTracing
// } from '@sentry/tracing';


if (window.SENTRY_JAVASCRIPT_KEY) {
    SentryInit({
        dsn: window.SENTRY_JAVASCRIPT_KEY,
        // integrations: [new BrowserTracing()],
        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
        ignoreErrors: [
            'TypeError: Failed to fetch',
            'TypeError: NetworkError when attempting to fetch resource.',
            'TypeError: cancelled',
            'TypeError: annulé',
            'TypeError: Load failed',
            'UnknownError: Background Sync is disabled.',
            'Error: QuotaExceededError: QuotaExceededError',
            'script-src wasm-eval:',
            /Loading CSS chunk/,
            /webkitExitFullScreen/,
            /webkitEnterFullscreen/,
            /fullscreen error/,
            /setIOSParameters/,
            /safari-web-extension/,
            /chrome-extension/,
            /script-src/,
            /manifest-src/,
            /font-src/,
            /script-src-elem/
        ]
        // beforeSend(event, hint) {
        //     // Check if it is an exception, and if so, show the report dialog
        //     if (event.exception) {
        //         SentryShowReportDialog({eventId: event.event_id});
        //     }
        //     return event;
        // }
    });

    SentryConfigureScope((scope) => {
        scope.setLevel('warning');

        if (window.currentUserId || window.currentUserSlug) {
            scope.setUser({
                id: window.currentUserId,
                username: window.currentUserSlug
            });
        }

        scope.setTag('locale', window.locale);
    });

    window.SentryWithScope = SentryWithScope;
    window.SentryCaptureException = SentryCaptureException;
    window.SentryCaptureMessage = SentryCaptureMessage;
}
