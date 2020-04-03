'use strict';

import '../../../stylesheets/pages/admins/articles.scss';

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
import AdminArticles from '../../components/admins/articles';

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminArticles/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-articles-component')
);
