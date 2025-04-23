import * as Utils from '@js/modules/utils';

import Notification from '@js/modules/notification';

import AnalyticsService from '@js/modules/analyticsService';
import PWAManager from '@js/modules/pwaManager';

class Layout {
    /* Public methods
    ******************** */
    // constructor() {
    // }

    initialize = () => {
        // Define settings and features
        window.settings = JSON.parse(document.getElementById('settings')?.innerText || '{}');

        // Check user and admin state
        window.currentUserId ||= Utils.getCookie('user.connected_id');
        window.currentAdminId ||= Utils.getCookie('admin.connected_id');

        // Initialize notifications
        setTimeout(() => Notification && Notification.initialize(), 50);

        // Analytics
        AnalyticsService.initialize();

        // PWA manager
        PWAManager.initialize();
    };

    /* Private methods
    ******************** */
}

export default new Layout();
