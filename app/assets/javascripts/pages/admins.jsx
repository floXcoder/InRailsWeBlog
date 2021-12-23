'use strict';

import '../../stylesheets/pages/admin.scss';

import AdminLayout from '../components/layouts/admin';

require('./common');

ReactDOM.render(
    <AdminLayout componentId="admins-component"/>,
    document.getElementById('admins-component')
);
