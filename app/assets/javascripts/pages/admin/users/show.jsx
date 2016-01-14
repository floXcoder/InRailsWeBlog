'use strict';

require('../admin');

let currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);

let UserShow = require('../../../components/users/show');

var userId = JSON.parse(document.getElementById('user-admin-component').getAttribute('data-user-id'));

// Main
if(currentUserId) {
    ReactDOM.render(
        <UserShow userId={userId}
                  currentUserId={currentUserId}/>,
        document.getElementById('user-admin-component')
    );
}

