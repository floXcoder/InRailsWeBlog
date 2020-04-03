'use strict';

import '../../../stylesheets/pages/admins/dashboard.scss';

import {
    Provider
} from 'react-redux';

import {
    configureStore
} from '../../stores/admin';

I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

require('../../translations/admin-' + I18n.locale);

require('../common');

import AdminLayout from '../../components/admins/adminLayout';
import AdminDashboard from '../../components/admins/dashboard';

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminDashboard/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-dashboard-component')
);
