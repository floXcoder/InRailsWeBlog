// jQuery
require('expose?$!expose?jQuery!jquery');
require('jquery-ujs');

// Expose global variables
require('expose?$app!./modules/app');
require('expose?$utils!./modules/utils');

// Materialize
require('expose?Hammer!hammerjs');
require('materialize-css/dist/js/materialize');

// Translation
require('./modules/i18n');
require('./modules/translation/fr.js');
require('./modules/translation/en.js');

// Declare Module Helpers
$app.moduleHelper = require('./modules/module-helper');

// Configure log level
if(window._rails_env === 'development') {
    log.setLevel('info');
} else {
    log.setLevel('warn');
}



