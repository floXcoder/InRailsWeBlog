'use strict';

import '../../application';

import AdminMenu from '../../components/admin/menu';
import AdminMessage from '../../components/admin/message';

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

        if(flashMessage && flashMessage.success) {
            Notification.success(flashMessage.success.replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }

        if(flashMessage && (flashMessage.notice || flashMessage.alert)) {
            Notification.alert((flashMessage.notice || flashMessage.alert).replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }

        if(flashMessage && flashMessage.error) {
            Notification.error(flashMessage.error.replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }
    }
});


ReactDOM.render(
    <AdminMenu/>,
    document.getElementById('admin-menu-component')
);

ReactDOM.render(
    <AdminMessage/>,
    document.getElementById('admin-message-component')
);
