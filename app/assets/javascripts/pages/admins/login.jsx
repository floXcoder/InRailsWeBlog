'use strict';

import '../../../stylesheets/pages/admin.scss';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';

import theme from '../../theme';

import AdminLogin from '../../components/admins/login';

require('../common');

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <AdminLogin/>
    </MuiThemeProvider>,
    document.getElementById('admins-login-component')
);
