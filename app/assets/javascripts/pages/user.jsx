'use strict';

import '../../stylesheets/pages/user.scss';

require('./common');

import ApplicationLayoutUser from '../components/layouts/user/application';

ReactDOM.render(
    <ApplicationLayoutUser staticContent={document.getElementById('static-component')?.innerHTML}
                           componentId="data-component"/>,
    document.getElementById('react-component')
);
