'use strict';

import '../../../stylesheets/pages/admins/login.scss';

I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

require('../../translations/admin-' + I18n.locale);

require('../common');

import AdminLogin from '../../components/admins/login';

ReactDOM.render(
    <AdminLogin/>,
    document.getElementById('admins-login-component')
);
