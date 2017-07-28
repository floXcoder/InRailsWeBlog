'use strict';

// require('../admin');

let UserIndex = require('../../../components/users/index');

// Main
if ($app.isUserConnected()) {
    ReactDOM.render(
        <UserIndex />,
        document.getElementById('users-admin-component')
    );
}

