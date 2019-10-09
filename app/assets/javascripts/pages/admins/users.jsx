'use strict';

import '../../../stylesheets/pages/admins/users.scss';

import {
    Provider
} from 'react-redux';

import {
    configureStore
} from '../../stores/admin';

import '../common';

I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

require('../../translations/admin-' + I18n.locale);

import AdminLayout from '../../components/admins/adminLayout';
import AdminUsers from '../../components/admins/users';

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminUsers/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-users-component')
);
