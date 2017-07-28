'use strict';

// require('./admin');

let ErrorIndex = require('../../../components/errors/index');

// Main
if ($app.isUserConnected()) {
    ReactDOM.render(
        <ErrorIndex />,
        document.getElementById('errors-admin-component')
    );
}

