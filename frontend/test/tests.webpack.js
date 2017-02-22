'use strict';

window.railsEnv = 'development';
// window.parameters = JSON.parse('');
window.userLatitude = '0.0';
window.userLongitutde = '0.0';
window.defaultLocale = 'fr';
window.locale = 'fr';

// Copy application file ...

// Load spec files
var context = require.context('../../spec/javascripts', true, /_spec\.jsx$/);
context.keys().forEach(context);
