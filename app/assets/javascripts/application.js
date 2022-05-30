'use strict';

// Error reporting
import {
    init as SentryInit,
    configureScope as SentryConfigureScope
} from '@sentry/browser';

import PWAManager from './modules/pwaManager';

// Auto polyfill
require('./polyfills');

I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;
I18n.translations = window.I18n.translations;
window.I18n = I18n;

if (window.SENTRY_JAVASCRIPT_KEY && !window.seoMode) {
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
            /Loading CSS chunk/
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

// PWA manager
PWAManager.initialize();

// Configure log level
if (GlobalEnvironment.NODE_ENV !== 'production') {
    const log = require('loglevel');
    log.setLevel('info');

    const screenLog = require('./modules/screenLog').default;
    screenLog.init({freeConsole: true});

    log.trace = (data) => {
        console.trace(data);
    };
    log.table = (data) => {
        console.table(data);
    };

    log.now = (data, colorStyle) => {
        screenLog.log(data, colorStyle);
    };

    window.w = log.info;
    window.log_on_screen = log.now;
}
