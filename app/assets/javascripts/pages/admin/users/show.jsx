'use strict';

// require('../admin');

let UserShow = require('../../../components/users/show');

var userId = JSON.parse(document.getElementById('user-admin-component').getAttribute('data-user-id'));

// Main
if($app.user.isConnected()) {
    ReactDOM.render(
        <UserShow userId={userId} />,
        document.getElementById('user-admin-component')
    );
}

