'use strict';

// jQuery
require('expose?$!expose?jQuery!jquery');
require('jquery-ujs');
// send CSRF tokens for all ajax requests
$.ajaxSetup({
    cache: false,
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
    }
});

// lodash
require('expose?_!lodash');

// React with Reflux
require("expose?React!react");
require("expose?ReactDOM!react-dom");
require("expose?Reflux!reflux");

// var reactTestUpdate = require("why-did-you-update");
// if (process.env.NODE_ENV !== 'production') {
//     reactTestUpdate.whyDidYouUpdate(React, { exclude: /^(?=EnhancedButton|FlatButton|FlatButtonLabel|FontIcon|Menu|Touch|Icon|Paper|EventListener|Overlay|AutoLock|Popover|List|MuiThemeProvider|ReactTransitionGroup|Card)/ })
// }

// Expose global variables
require('./modules/utils');
require('expose?$app!./modules/app');
$app.init();

// Materialize
require('expose?Hammer!hammerjs');
require('materialize-css/dist/js/materialize');

// Automatic dropdown on hover
$('.dropdown-button').dropdown({
    hover: true,
    belowOrigin: true
});

// Keyboard inputs
require('expose?Mousetrap!mousetrap');

// Translation
require('expose?I18n!./modules/i18n');
require('./modules/translation/fr.js');
require('./modules/translation/en.js');
I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

// Configure log level
if (window.railsEnv === 'development') {
    log.setLevel('info');
    var screenLog = require('./modules/screenLog');
    screenLog.init({freeConsole: true});
    log.now = function (data, colorStyle) {
        screenLog.log(data, colorStyle);
    };
} else {
    log.setLevel('warn');
    log.now = function () {
    };
}

// Error management
var ErrorActions = require('./actions/errorActions');
require('./stores/errorStore');
window.onerror = function (message, url, lineNumber, columnNumber, trace) {
    if(!trace)  {
        trace = {};
    }

    ErrorActions.pushError({
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
    var msViewportStyle = document.createElement('style');
    msViewportStyle.appendChild(
        document.createTextNode(
            '@-ms-viewport{width:auto!important}'
        )
    );
    document.querySelector('head').appendChild(msViewportStyle);
}
