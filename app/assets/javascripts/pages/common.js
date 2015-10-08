require('../application');

// Got to top button
$utils.goToTop();

// Automatic dropdown on hover
$(".dropdown-button").dropdown({
    hover: true,
    belowOrigin: true
});

