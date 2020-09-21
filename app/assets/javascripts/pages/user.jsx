'use strict';

import '../../stylesheets/pages/user.scss';

require('./common');

import ApplicationLayoutUser from '../components/layouts/user/application';

ReactDOM.render(
    <ApplicationLayoutUser staticContent={document.getElementById('static-content')?.innerHTML}
                           {...Utils.extractDataFromElement('react-component')}/>,
    document.getElementById('react-component')
);
