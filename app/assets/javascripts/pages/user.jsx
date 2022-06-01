'use strict';

import '../../stylesheets/pages/user.scss';

import ApplicationLayoutUser from '../components/layouts/user/application';

require('./common');

const root = ReactCreateRoot(document.getElementById('react-component'));
root.render(
    <ApplicationLayoutUser staticContent={document.getElementById('static-component')?.innerHTML}
                           componentId="data-component"/>
);
