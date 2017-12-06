'use strict';

import UserShow from '../../../components/users/show';

const userId = JSON.parse(document.getElementById('user-admin-component').getAttribute('data-user-id'));

// TODO: use redux global state instead of $app
if ($app.isUserConnected()) {
    ReactDOM.render(
        <UserShow userId={userId}/>,
        document.getElementById('user-admin-component')
    );
}

