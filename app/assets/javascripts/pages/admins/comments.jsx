'use strict';

import '../../../stylesheets/pages/admins/comments.scss';

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
import AdminComments from '../../components/admins/comments';

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminComments/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-comments-component')
);
