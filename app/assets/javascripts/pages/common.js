"use strict";

require('../application');

require('../components/user/navigation');
require('../components/tags/sidebar');

// Automatic dropdown on hover
$(".dropdown-button").dropdown({
    hover: false,
    gutter: 0,
    belowOrigin: true
});

// Initialize SideNav
$('.navbar-fixed .button-collapse').sideNav({
        menuWidth: 350, // Default is 240
        edge: 'left' // Choose the horizontal origin
    }
);

// Header : close side nav on click for preferences and tags
$('.button-collapse').click(function (event) {
    if(event && (event.target.id === 'toggle-tags' || event.target.id === 'toggle-user-pref')) {
        $('.button-collapse').sideNav('hide');
    }
    return true;
});

// Got to top button
$('.goto-top').goToTop();


// Flash messages
$('.blog-flash').each(function() {
    var $this = $(this);
    Materialize.toast($this.html(), 3000);
});

// Activate article creation
if(window.currentUserId === 'null') {
    $('a#toggle-article-creation').click(function () {
        Materialize.toast(I18n.t('js.article.flash.creation_unpermitted'), 5000);
        return false;
    }.bind(this));
}
