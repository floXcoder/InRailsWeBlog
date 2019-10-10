'use strict';

import '../../../stylesheets/pages/admins/articles.scss';

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
import AdminArticles from '../../components/admins/articles';

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminArticles/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-articles-component')
);
