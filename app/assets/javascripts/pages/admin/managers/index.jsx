'use strict';

import UserIndex from '../../../components/users/index';

// TODO: use redux global state instead of $app
if ($app.isUserConnected()) {
    ReactDOM.render(
        <UserIndex />,
        document.getElementById('users-admin-component')
    );
}

