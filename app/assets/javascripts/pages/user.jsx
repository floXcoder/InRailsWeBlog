'use strict';

import '../../stylesheets/pages/user.scss';

import ApplicationLayoutUser from '../components/layouts/user/application';

require('./common');

ReactDOM.render(
    <ApplicationLayoutUser staticContent={document.getElementById('static-component')?.innerHTML}
                           componentId="data-component"/>,
    document.getElementById('react-component')
);
