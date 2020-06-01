'use strict';

// Auto polyfill
require('./polyfills');

import {
    init as SentryInit,
    configureScope as SentryConfigureScope
} from '@sentry/browser';

if (window.SENTRY_JAVASCRIPT_KEY && !window.seoMode) {
    SentryInit({
        dsn: window.SENTRY_JAVASCRIPT_KEY,
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

        scope.setUser({
            id: window.currentUserId,
            username: window.currentUserSlug
        });

        scope.setTag('locale', window.locale);
    });
}

// Configure log level
if (process.env.NODE_ENV !== 'production') {
    const log = require('loglevel');

    log.setLevel('info');

    log.now = (data, colorStyle) => {
        screenLog.log(data, colorStyle);
    };

    log.trace = data => {
        console.trace(data);
    };
    log.table = data => {
        console.table(data);
    };

    window.w = log.info;

    const screenLog = require('./modules/screenLog').default;
    screenLog.init({freeConsole: true});
}

if (window._paq && !window.seoMode) {
    perfMetrics.onFirstInputDelay(function (delay, event) {
        window._paq.push(['trackEvent', 'First Input Delay', event.type, event.type, Math.round(delay)]);
    });
}
