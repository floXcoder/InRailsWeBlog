'use strict';

import {
    init as SentryInit,
    configureScope as SentryConfigureScope,
    // showReportDialog as SentryShowReportDialog
} from '@sentry/browser';


if (window.SENTRY_JAVASCRIPT_KEY) {
    SentryInit({
        dsn: window.SENTRY_JAVASCRIPT_KEY,
        ignoreErrors: [
            'TypeError: Failed to fetch',
            'TypeError: NetworkError when attempting to fetch resource.',
            'TypeError: cancelled',
            'TypeError: annulé',
            'TypeError: Load failed',
            'UnknownError: Background Sync is disabled.',
            'Error: QuotaExceededError: QuotaExceededError',
            /Loading CSS chunk/,
            /webkitExitFullScreen/,
            /webkitEnterFullscreen/,
            /fullscreen error/,
            /setIOSParameters/,
            /safari-web-extension/,
            /chrome-extension/,
            /Blocked/,
            /wasm/,
            /script-src/,
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
}
