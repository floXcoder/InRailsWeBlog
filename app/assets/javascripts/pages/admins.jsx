'use strict';

import '../../stylesheets/pages/admin.scss';

import AdminLayout from '../components/layouts/admin';

require('./common');

const root = ReactCreateRoot(document.getElementById('admins-component'));
root.render(
    <AdminLayout componentId="admins-component"/>
);
