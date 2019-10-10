'use strict';

import '../../../stylesheets/pages/admins/topics.scss';

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
import AdminTopics from '../../components/admins/topics';

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminTopics/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-topics-component')
);
