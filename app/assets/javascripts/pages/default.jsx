'use strict';

import '../../stylesheets/pages/default.scss';

require('./common');

require('../modules/cookieChoices');

import ApplicationLayoutDefault from '../components/layouts/default/application';

ReactDOM.render(
    <ApplicationLayoutDefault staticContent={document.getElementById('static-content')?.innerHTML}
                              {...Utils.extractDataFromElement('react-component')}/>,
    document.getElementById('react-component')
);
