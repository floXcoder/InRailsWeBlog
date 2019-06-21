'use strict';

// Auto polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Polyfill observer
import 'intersection-observer';

import 'first-input-delay/dist/first-input-delay.min';

import {
    init as SentryInit,
    configureScope as SentryConfigureScope,
    showReportDialog as SentryShowReportDialog,
} from '@sentry/browser';

if (window.SENTRY_JAVASCRIPT_KEY) {
    SentryInit({
        dsn: window.SENTRY_JAVASCRIPT_KEY,
        beforeSend(event, hint) {
            // Check if it is an exception, and if so, show the report dialog
            if (event.exception) {
                SentryShowReportDialog({eventId: event.event_id});
            }
            return event;
        }
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

// Expose global variables
import * as utils from './modules/utils';

window.Utils = utils;

// Notifications
import NotificationLayout from './components/layouts/notification';

window.Notification = NotificationLayout;

// Translation
import I18n from 'imports-loader?this=>window!./modules/i18n';

window.I18n = I18n;
window.I18n.defaultLocale = window.defaultLocale;
window.I18n.locale = window.locale;

// Image lazyloading
import 'lazysizes';

// Configure log level
if (process.env.NODE_ENV === 'production') {
    log.setLevel('warn');
    log.now = () => {
    };
} else {
    log.setLevel('info');
    log.now = (data, colorStyle) => {
        screenLog.log(data, colorStyle);
    };

    window.w = log.info;

    const screenLog = require('./modules/screenLog').default;
    screenLog.init({freeConsole: true});
}

log.trace = data => {
    console.trace(data);
};
log.table = data => {
    console.table(data);
};

if (window._paq) {
    perfMetrics.onFirstInputDelay(function (delay, event) {
        window._paq.push(['trackEvent', 'First Input Delay', event.type, event.type, Math.round(delay)]);
    });
}
