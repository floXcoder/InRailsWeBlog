'use strict';

I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;
I18n.translations = window.I18n.translations;
window.I18n = I18n;

// Auto polyfill
require('./polyfills');

// Error reporting
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

// Initialize routes
import RouteManager from './modules/routeManager';

RouteManager.initialize();

// PWA manager
import PWAManager from './modules/pwaManager';

PWAManager.initialize();

// Configure log level
if (js_environment.NODE_ENV !== 'production') {
    const log = require('loglevel');
    log.setLevel('info');

    const screenLog = require('./modules/screenLog').default;
    screenLog.init({freeConsole: true});

    log.trace = data => {
        console.trace(data);
    };
    log.table = data => {
        console.table(data);
    };

    log.now = (data, colorStyle) => {
        screenLog.log(data, colorStyle);
    };

    window.w = log.info;
    window.log_on_screen = log.now;
}
