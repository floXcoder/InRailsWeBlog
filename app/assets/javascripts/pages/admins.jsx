'use strict';

import '../../stylesheets/pages/admin.scss';

require('./common');

import AdminLayout from '../components/layouts/admin';

ReactDOM.render(
    <AdminLayout componentId="admins-component"/>,
    document.getElementById('admins-component')
);
