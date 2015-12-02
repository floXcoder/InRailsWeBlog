'use strict';

require('../application');

require('../components/user/navigation');
require('../components/tags/sidebar');

// Automatic dropdown on hover
$('.dropdown-button').dropdown({
    hover: false,
    belowOrigin: true
});

// Initialize all SideNav
if(window.innerWidth > window.parameters.medium_screen_up) {
    $('header .button-collapse').sideNav({
            menuWidth: 350,
            edge: 'left'
        }
    );
} else {
    $('header .button-collapse').sideNav({
            menuWidth: 260,
            edge: 'left'
        }
    );
}


// Flash messages
$('.blog-flash').each(function() {
    var $this = $(this);
    Materialize.toast($this.html(), 3000);
});

// Header : close side nav on click for preferences or tags
$('.button-collapse').click(function (event) {
    if(event && (event.target.id === 'toggle-tags' || event.target.id === 'toggle-user-pref')) {
        $('#toggle-navbar').sideNav('hide');
    }
    return true;
});

// Activate article creation
if(window.currentUserId === 'null') {
    $('a#toggle-article-creation').click(function (event) {
        event.preventDefault();
        Materialize.toast(I18n.t('js.article.flash.creation_unpermitted'), 5000);
    });
}
