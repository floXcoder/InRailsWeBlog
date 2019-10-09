'use strict';

import '../../../stylesheets/pages/admins/login.scss';

import '../common';

I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

require('../../translations/admin-' + I18n.locale);

import AdminLogin from '../../components/admins/login';

ReactDOM.render(
    <AdminLogin/>,
    document.getElementById('admins-login-component')
);
