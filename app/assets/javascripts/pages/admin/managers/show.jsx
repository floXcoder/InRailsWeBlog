'use strict';

import UserShow from '../../../components/users/show';

const userId = JSON.parse(document.getElementById('user-admin-component').getAttribute('data-user-id'));

// Main
if ($app.isUserConnected()) {
    ReactDOM.render(
        <UserShow userId={userId}/>,
        document.getElementById('user-admin-component')
    );
}

