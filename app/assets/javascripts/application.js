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
if (window._rails_env === 'development') {
    log.setLevel('info');
} else {
    log.setLevel('warn');
}
