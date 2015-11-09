require('../application');

require('../components/user/navigation');
require('../components/tags/sidebar');

// Got to top button
$('.goto-top').goToTop();

// Automatic dropdown on hover
$(".dropdown-button").dropdown({
    hover: true,
    belowOrigin: true
});

$('.blog-flash').each(function() {
    var $this = $(this);

    Materialize.toast($this.html(), 3000);
});

if(window.currentUserId === 'null') {
    $('a#toggle-article-creation').click(function () {
        Materialize.toast(I18n.t('js.article.flash.write_article'), 5000);

        return false;
    }.bind(this));
}
