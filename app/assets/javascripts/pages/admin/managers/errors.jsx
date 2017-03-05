'use strict';

// require('./admin');

let ErrorIndex = require('../../../components/errors/index');

// Main
if ($app.user.isConnected()) {
    ReactDOM.render(
        <ErrorIndex />,
        document.getElementById('errors-admin-component')
    );
}

