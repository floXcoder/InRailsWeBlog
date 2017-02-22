'use strict';

require('../../application');

var AdminMenu = require('../../components/admin/menu');

// Flash messages
$('.blog-flash').each(function() {
    var $this = $(this);
    Materialize.toast($this.html(), 3000);
});

$(document).ajaxComplete(function (event, request) {
    if (request.getResponseHeader('X-Flash-Messages')) {
        var flashMessage = JSON.parse(decodeURIComponent(escape(request.getResponseHeader('X-Flash-Messages'))));

        if(flashMessage && flashMessage.success) {
            Materialize.toast(flashMessage.success, 3000);
        }

        if(flashMessage && flashMessage.notice) {
            Materialize.toast(flashMessage.notice, 3000);
        }

        if(flashMessage && flashMessage.error) {
            Materialize.toast(flashMessage.error, 3000);
        }
    }
});


ReactDOM.render(
    <AdminMenu/>,
    document.getElementById('admin-menu-component')
);
