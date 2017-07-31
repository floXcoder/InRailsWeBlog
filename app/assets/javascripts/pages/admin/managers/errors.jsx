'use strict';

import ErrorIndex from '../../../components/errors/index';

// Main
if ($app.isUserConnected()) {
    ReactDOM.render(
        <ErrorIndex />,
        document.getElementById('errors-admin-component')
    );
}

