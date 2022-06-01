'use strict';

import '../../stylesheets/pages/default.scss';

import ApplicationLayoutDefault from '../components/layouts/default/application';

require('./common');

require('../modules/cookieChoices');

const root = ReactCreateRoot(document.getElementById('react-component'));
root.render(
    <ApplicationLayoutDefault staticContent={document.getElementById('static-component')?.innerHTML}
                              componentId="data-component"/>
);
