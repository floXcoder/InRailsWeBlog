'use strict';

// Got to top button
$('.goto-top').goToTop();

// Navigation bar
var SearchModule = require('../../components/search/module');
ReactDOM.render(
    <SearchModule/>,
    document.getElementById('search-nav-component')
);

if(currentUserId) {
    var UserPreference = require('../../components/users/preference');
    ReactDOM.render(
        <UserPreference/>,
        document.getElementById('user-pref')
    );
}

$('a#user-dropdown-link').click(function () {
    var connectionLoader = require('../../loaders/connection');
    connectionLoader().then(({ Login, Signup }) => {
        ReactDOM.render(
            <Login buttonId="login-link"/>,
            document.getElementById('login-modal-component')
        );

        ReactDOM.render(
            <Signup buttonId="signup-link"/>,
            document.getElementById('signup-modal-component')
        );
    });

    return true;
});
