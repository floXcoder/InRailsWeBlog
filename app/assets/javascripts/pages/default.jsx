'use strict';

import '../../stylesheets/pages/default.scss';

import ApplicationLayoutDefault from '../components/layouts/default/application';

require('./common');

require('../modules/cookieChoices');

ReactDOM.render(
    <ApplicationLayoutDefault staticContent={document.getElementById('static-component')?.innerHTML}
                              componentId="data-component"/>,
    document.getElementById('react-component')
);
