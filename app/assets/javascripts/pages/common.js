'use strict';

import '../application';
import '../modules/validation';

import '../components/users/account';
import '../components/search/modal';

// Initialize all SideNav
if (window.innerWidth > window.parameters.medium_screen_up) {
    $('header').find('.button-collapse').sideNav({
            menuWidth: 350,
            edge: 'left'
        }
    );
} else {
    $('header').find('.button-collapse').sideNav({
            menuWidth: 260,
            edge: 'left'
        }
    );
}

// Got to top button
// $('.goto-top').goToTop();

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

$(document).ajaxComplete((event, request) => {
    if (request.getResponseHeader('X-Flash-Messages')) {

        const flashMessage = JSON.parse(decodeURIComponent(escape(request.getResponseHeader('X-Flash-Messages'))));

        if (flashMessage && flashMessage.success) {
            Notification.success(flashMessage.success.replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }

        if (flashMessage && (flashMessage.notice || flashMessage.alert)) {
            Notification.alert(flashMessage.notice.replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }

        if (flashMessage && flashMessage.error) {
            Notification.error(flashMessage.error.replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }
    }
});
