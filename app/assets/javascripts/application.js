// jQuery
require('expose?$!expose?jQuery!jquery');
require('jquery-ujs');

// Materialize
require('materialize-css/dist/js/materialize');

// Translation
require('./modules/i18n');
require('./modules/translation/fr.js');
require('./modules/translation/en.js');

// Declare global variables
var $app = require('./modules/app');
var $log = require('loglevel');
var $utils = require('./modules/utils');
var $moduleHelper = require('./modules/module-helper');

// Configure log level
if(window._rails_env === 'development') {
    $log.setLevel('info');
} else {
    $log.setLevel('warn');
}

