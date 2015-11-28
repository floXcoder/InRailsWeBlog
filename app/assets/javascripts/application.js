'use strict';

// jQuery
require('expose?$!expose?jQuery!jquery');
require('jquery-ujs');

// lodash
require('expose?_!lodash');

// React with Reflux
require("expose?React!react");
require("expose?ReactDOM!react-dom");
require("expose?Reflux!reflux");

// Expose global variables
var $app = require('expose?$app!./modules/app');
require('./modules/utils');

// Materialize
require('expose?Hammer!hammerjs');
require('materialize-css/dist/js/materialize');

// Translation
require('expose?I18n!./modules/i18n');
require('./modules/translation/fr.js');
require('./modules/translation/en.js');
I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

// Declare Module Helpers
$app.start();
$app.moduleHelper = require('./modules/module-helper');

// Configure log level
if (window.railsEnv === 'development') {
    log.setLevel('info');
    var screenLog = require('./modules/screenLog');
    screenLog.init({freeConsole: true});
    log.now = function (data, colorStyle) {
        screenLog.log(data, colorStyle);
    };
    window.onerror = function (msg, url, linenumber) {
        log.now('Error: ' + msg + ' (File: ' + url + ' ; ' + linenumber + ')', 'red');
        return false;
    }.bind(log);
} else {
    log.setLevel('warn');
    log.now = function () {
    };
}

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
