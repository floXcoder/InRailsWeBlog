'use strict';

import '../../../stylesheets/pages/admins/tags.scss';

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
import AdminTags from '../../components/admins/tags';

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminTags/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-tags-component')
);
