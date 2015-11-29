'use strict';

require('./common');

let ErrorIndex = require('../components/errors/index');

let currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);

// Main
if(currentUserId) {
    ReactDOM.render(
        <ErrorIndex />,
        document.getElementById('admin-component')
    );
}

