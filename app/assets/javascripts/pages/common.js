'use strict';

require('../application');

// Flash messages
$('.blog-flash').each(function() {
    var $this = $(this);
    Materialize.toast($this.html(), 5000);
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

// Header : close side nav on click for preferences or tags
$('.button-collapse').click(function (event) {
    if(event && (event.target.id === 'toggle-tags' || event.target.id === 'toggle-user-pref')) {
        $('#toggle-navbar').sideNav('hide');
    }
    return true;
});

// Activate article creation
if($app.user.isConnected()) {
    $('a#toggle-article-creation').click(function (event) {
        event.preventDefault();
        Materialize.toast(I18n.t('js.article.flash.creation_unpermitted'), 5000);
    });
}

// // Common url shortcuts
// // All articles
// Mousetrap.bind('alt+a', function () {
//     if($app.user.isConnected()) {
//         window.location.pathname = '/users/' + window.currentUserId;
//     }
//     return false;
// }.bind(this), 'keydown');
//
// // Temporary articles
// Mousetrap.bind('alt+v', function () {
//     if($app.user.isConnected()) {
//         window.location.pathname = '/users/' + window.currentUserId + '/temporary';
//     }
//     return false;
// }.bind(this), 'keydown');
//
// // Bookmarked articles
// Mousetrap.bind('alt+b', function () {
//     if($app.user.isConnected()) {
//         window.location.pathname = '/users/' + window.currentUserId + '/bookmarks';
//     }
//     return false;
// }.bind(this), 'keydown');


