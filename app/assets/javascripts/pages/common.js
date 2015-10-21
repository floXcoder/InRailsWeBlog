require('../application');

// Got to top button
$utils.goToTop();

// Automatic dropdown on hover
$(".dropdown-button").dropdown({
    hover: true,
    belowOrigin: true
});

// Auto hide flash messages
var flashCallback = function() {
    return $(".blog-flash").fadeOut(1000);
};
setTimeout(flashCallback, 1000);
