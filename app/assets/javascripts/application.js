'use strict';

import AnalyticsService from './modules/analyticsService';
import PWAManager from './modules/pwaManager';

// Auto polyfill
require('./polyfills');

// Error reporting
require('./modules/sentry');

// Define settings
window.settings = JSON.parse(document.getElementById('settings')?.innerText || '{}');

// Analytics
AnalyticsService.initialize();

// PWA manager
PWAManager.initialize();

// Configure log level
if (GlobalEnvironment.NODE_ENV !== 'production') {
    require('./modules/debugLog');
}
