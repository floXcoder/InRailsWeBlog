'use strict';

import '../../../stylesheets/pages/admins/cache.scss';

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
import AdminCache from '../../components/admins/cache';

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminCache/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-cache-component')
);
