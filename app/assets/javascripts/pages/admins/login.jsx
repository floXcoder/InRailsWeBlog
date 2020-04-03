'use strict';

import '../../../stylesheets/pages/admins/login.scss';

window.I18n.defaultLocale = window.defaultLocale;
window.I18n.locale = window.locale;

require('imports-loader?this=>window!../../modules/i18n');

require('../common');

import AdminLogin from '../../components/admins/login';

ReactDOM.render(
    <AdminLogin/>,
    document.getElementById('admins-login-component')
);
