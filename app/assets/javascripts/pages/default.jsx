'use strict';

import '../../stylesheets/pages/default.scss';

import ApplicationLayoutDefault from '../components/layouts/default/application';

require('./common');

// For the website use (no external tracking, no ads), cookies consent are useless
// require('../modules/cookieChoices');

const root = ReactCreateRoot(document.getElementById('react-component'));
root.render(
    <ApplicationLayoutDefault staticContent={document.getElementById('static-component')?.innerHTML}
                              componentId="data-component"/>
);
