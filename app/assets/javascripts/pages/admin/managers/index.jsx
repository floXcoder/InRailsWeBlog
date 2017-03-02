'use strict';

// require('../admin');

let UserIndex = require('../../../components/users/index');

// Main
if ($app.user.isConnected()) {
    ReactDOM.render(
        <UserIndex />,
        document.getElementById('users-admin-component')
    );
}

