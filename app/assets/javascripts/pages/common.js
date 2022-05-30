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
    setTimeout(function () {
        if (level === 'success') {
            Notification.message.success(element.innerHTML);
        } else if (level === 'error') {
            Notification.message.error(element.innerHTML);
        } else {
            Notification.message.alert(element.innerHTML);
        }
    }, 300);

    if (sessionStorage) {
        sessionStorage.setItem(`flash-message-${token}`, 'true');
    }
});
