'use strict';

import AnalyticsService from './modules/analyticsService';
import PWAManager from './modules/pwaManager';

// Auto polyfill => polyfill are loaded in a dedicated file only if browser doesn't support es6
// require('./polyfills');

// Error reporting
if (GlobalEnvironment.NODE_ENV === 'production') {
    require('./modules/sentry');
}

// Define settings
window.settings = JSON.parse(document.getElementById('settings')?.innerText || '{}');

// Analytics
AnalyticsService.initialize();

// PWA manager
PWAManager.initialize();

// Configure log level
if (GlobalEnvironment.NODE_ENV !== 'production') {
    require('./modules/debugLog');
    require('./modules/debugHelper');
}
