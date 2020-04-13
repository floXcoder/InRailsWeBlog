'use strict';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';

import '../../../stylesheets/pages/admins/login.scss';

window.I18n.defaultLocale = window.defaultLocale;
window.I18n.locale = window.locale;

require('imports-loader?this=>window!../../modules/i18n');

require('../common');

import AdminLogin from '../../components/admins/login';

import theme from '../../../jss/theme';

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <AdminLogin/>
    </MuiThemeProvider>,
    document.getElementById('admins-login-component')
);
