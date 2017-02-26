'use strict';

// jQuery
require('jquery-ujs');
// send CSRF tokens for all ajax requests
$.ajaxSetup({
    cache: false,
    beforeSend: function (xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
    }
});

// Materialize
require('materialize-css/dist/js/materialize');

// Expose global variables
require('./modules/utils');

// Notifications
require('expose-loader?Notification!./components/theme/notification');

// Automatic dropdown on hover
$('.dropdown-button').dropdown({
    hover: false,
    belowOrigin: true
});

// Keyboard inputs
require('expose?Mousetrap!mousetrap');

// Translation
require('expose-loader?I18n!imports-loader?define=>false,require=>false!./modules/i18n');
I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

// var reactTestUpdate = require("why-did-you-update");
// if (process.env.NODE_ENV !== 'production') {
//     reactTestUpdate.whyDidYouUpdate(React, { exclude: /^(?=EnhancedButton|FlatButton|FlatButtonLabel|FontIcon|Menu|Touch|Icon|Paper|EventListener|Overlay|AutoLock|Popover|List|MuiThemeProvider|ReactTransitionGroup|Card)/ })
// }

// Configure log level
if (window.railsEnv === 'development') {
    log.setLevel('info');
    const screenLog = require('./modules/screenLog');
    screenLog.init({freeConsole: true});
    log.now = function (data, colorStyle) {
        screenLog.log(data, colorStyle);
    };
} else {
    log.setLevel('warn');
    log.now = function () {
    };
}

log.table = function (data) {
    console.table(data);
};

// Error management
import ErrorStore from './stores/errorStore';
window.onerror = function (message, url, lineNumber, columnNumber, trace) {
    try {
        const reactRootComponent = document.getElementsByClassName('react-root');

        if (reactRootComponent[0]) {
            // Test if React component
            if (!ReactDOM.findDOMNode(reactRootComponent[0]).children[0]) {
                Materialize.toast(I18n.t('js.helpers.errors.frontend') + '&nbsp;<a href="/">' + I18n.t('js.helpers.home') + '</a>');
            }
        }
    }
    catch (e) {
        // Root node is not a React component so React is not mounted
        Materialize.toast(I18n.t('js.helpers.errors.frontend') + '&nbsp;<a href="/">' + I18n.t('js.helpers.home') + '</a>');
    }

    if (!trace) {
        trace = {};
    }

    ErrorStore.pushError({
        message: message,
        url: url,
        lineNumber: lineNumber,
        columnNumber: columnNumber,
        trace: trace.stack,
        origin: 'client'
    });

    if (window.railsEnv === 'development') {
        log.now('Error: ' + message + ' (File: ' + url + ' ; ' + lineNumber + ')', 'red');
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
