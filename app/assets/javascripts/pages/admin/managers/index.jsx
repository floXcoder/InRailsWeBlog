'use strict';

import UserIndex from '../../../components/users/index';

// Main
if ($app.isUserConnected()) {
    ReactDOM.render(
        <UserIndex />,
        document.getElementById('users-admin-component')
    );
}

