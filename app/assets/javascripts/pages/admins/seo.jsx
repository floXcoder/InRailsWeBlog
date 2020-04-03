'use strict';

import '../../../stylesheets/pages/admins/seo.scss';

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
import AdminSeoData from '../../components/admins/seoData';

const seoPages = JSON.parse(document.getElementById('admins-seo-component').getAttribute('data-seo-pages'));

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminSeoData seoPages={seoPages}/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-seo-component')
);
