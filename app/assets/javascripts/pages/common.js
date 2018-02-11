'use strict';

import '../application';

// TODO: use a customized navbar
// // Initialize all SideNav
// if (window.innerWidth > window.settings.medium_screen_up) {
//     $('header').find('.button-collapse').sideNav({
//             menuWidth: 350,
//             edge: 'left'
//         }
//     );
// } else {
//     $('header').find('.button-collapse').sideNav({
//             menuWidth: 260,
//             edge: 'left'
//         }
//     );
// }

// Flash messages
$('.blog-flash').each((index, element) => {
    const $element = $(element);
    const level = $element.data('level');
    const token = $element.data('flash-token');

    if (sessionStorage) {
        // Do not display same flash message twice
        if(sessionStorage.getItem(`flash-message-${token}`)) {
            return;
        }
    }

    if (level === 'success') {
        Notification.success($element.html());
    } else if (level === 'error') {
        Notification.error($element.html());
    } else {
        Notification.alert($element.html());
    }

    if (sessionStorage) {
        sessionStorage.setItem(`flash-message-${token}`, 'true');
    }
});
