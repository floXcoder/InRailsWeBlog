'use strict';

require('../application');

import {
    setConfig
} from 'react-hot-loader';

setConfig({
    reloadHooks: false
});

// Flash messages
const flashes = document.querySelectorAll('.blog-flash');
Array.prototype.forEach.call(flashes, function (element, index) {
    const level = element.getAttribute('data-level');
    const token = element.getAttribute('data-flash-token');

    if (sessionStorage) {
        // Do not display same flash message twice
        if (sessionStorage.getItem(`flash-message-${token}`)) {
            return;
        }
    }

    if (level === 'success') {
        Notification.success(element.innerHTML);
    } else if (level === 'error') {
        Notification.error(element.innerHTML);
    } else {
        Notification.alert(element.innerHTML);
    }

    if (sessionStorage) {
        sessionStorage.setItem(`flash-message-${token}`, 'true');
    }
});
