'use strict';

__webpack_public_path__ = process.env.ASSET_PATH;

// Auto polyfill
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Polyfill promise
require('es6-promise').polyfill();

// Polyfill observer
import 'intersection-observer';

// jQuery
import 'jquery-ujs';

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
