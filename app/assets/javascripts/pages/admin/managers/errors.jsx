'use strict';

import ErrorIndex from '../../../components/errors/index';

// TODO: use redux global state instead of $app
if ($app.isUserConnected()) {
    ReactDOM.render(
        <ErrorIndex />,
        document.getElementById('errors-admin-component')
    );
}

