'use strict';

import '../application';

// Flash messages
$('.blog-flash').each((index, element) => {
    const $element = $(element);
    const level = $element.data('level');

    if (level === 'success') {
        Notification.success($element.html());
    } else if (level === 'error') {
        Notification.error($element.html());
    } else {
        Notification.alert($element.html());
    }
});
