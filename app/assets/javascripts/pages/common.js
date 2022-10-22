'use strict';

require('../application');


// Flash messages
const flashes = document.querySelectorAll('.blog-flash');
Array.prototype.forEach.call(flashes, function (element) {
    const level = element.getAttribute('data-level');
    const token = element.getAttribute('data-flash-token');

    if (sessionStorage) {
        // Do not display same flash message twice
        if (sessionStorage.getItem(`flash-message-${token}`)) {
            return;
        }
    }

    // Let's the Notification component initialize
    document.addEventListener('DOMContentLoaded', () => {
        if (level === 'success') {
            Notification.success(element.innerHTML);
        } else if (level === 'error') {
            Notification.error(element.innerHTML);
        } else {
            Notification.alert(element.innerHTML);
        }
    });

    if (sessionStorage) {
        sessionStorage.setItem(`flash-message-${token}`, 'true');
    }
});
