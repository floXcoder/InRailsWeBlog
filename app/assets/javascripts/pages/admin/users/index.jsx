'use strict';

require('../admin');

let currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);

let UserIndex = require('../../../components/users/index');

// Main
if(currentUserId) {
    ReactDOM.render(
        <UserIndex />,
        document.getElementById('users-admin-component')
    );
}

