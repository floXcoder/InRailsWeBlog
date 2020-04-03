'use strict';

import '../../../stylesheets/pages/admins/cache.scss';

import {
    Provider
} from 'react-redux';

import {
    configureStore
} from '../../stores/admin';

window.I18n.defaultLocale = window.defaultLocale;
window.I18n.locale = window.locale;

require('imports-loader?this=>window!../../modules/i18n');

require('../common');

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
