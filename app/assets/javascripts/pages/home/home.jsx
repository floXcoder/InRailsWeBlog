'use strict';

import '../../../stylesheets/pages/home/home.scss';

require('../common');

require('../../modules/cookieChoices');

import ApplicationLayoutHome from '../../components/layouts/home/application';

ReactDOM.render(
    <ApplicationLayoutHome/>,
    document.getElementById('home-component')
);
