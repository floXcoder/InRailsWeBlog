'use strict';

import '../../../stylesheets/pages/admins/blogs.scss';

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
import AdminBlogs from '../../components/admins/blogs';

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminBlogs/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-blogs-component')
);
