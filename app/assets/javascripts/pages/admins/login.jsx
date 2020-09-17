'use strict';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';

import '../../../stylesheets/pages/admin.scss';

require('../common');

import theme from '../../../jss/theme';

import AdminLogin from '../../components/admins/login';

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <AdminLogin/>
    </MuiThemeProvider>,
    document.getElementById('admins-login-component')
);
