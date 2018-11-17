'use strict';

__webpack_public_path__ = process.env.ASSET_PATH;

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
import Notification from './components/theme/notification';

window.Notification = Notification;

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

// Error management
import {pushError} from './actions/errorActions';

window.onerror = function (message, url, lineNumber, columnNumber, trace) {
    try {
        const reactRootComponent = document.getElementsByClassName('react-root');

        if (reactRootComponent[0]) {
            // Test if React component
            if (!ReactDOM.findDOMNode(reactRootComponent[0]).children[0]) {
                Notification.alert(I18n.t('js.helpers.errors.frontend'), 300, I18n.t('js.helpers.home'), () => window.location = '/');
            }
        }
    }
    catch (e) {
        // Root node is not a React component so React is not mounted
        Notification.alert(I18n.t('js.helpers.errors.frontend'), 300, I18n.t('js.helpers.home'), () => window.location = '/');
    }

    if (!trace) {
        trace = {};
    }

    if (message && trace.stack) {
        pushError({
            message,
            url,
            lineNumber,
            columnNumber,
            trace: trace.stack,
            origin: 'client'
        });
    }

    if (process.env.NODE_ENV !== 'production') {
        log.now('Error: ' + message + ' (File: ' + url + ' ; ' + lineNumber + ')', 'text-error');
    }
};

// IE10 viewport hack for Surface/desktop Windows 8 bug
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    const msViewportStyle = document.createElement('style');
    msViewportStyle.appendChild(
        document.createTextNode(
            '@-ms-viewport{width:auto!important}'
        )
    );
    document.querySelector('head').appendChild(msViewportStyle);
}
