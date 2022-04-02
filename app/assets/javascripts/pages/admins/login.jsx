'use strict';

import '../../../stylesheets/pages/admin.scss';

import {
    ThemeProvider,
    StyledEngineProvider
} from '@mui/material/styles';

import theme from '../../theme';

import AdminLogin from '../../components/admins/login';

require('../common');

ReactDOM.render(
    <StyledEngineProvider injectFirst={true}>
        <ThemeProvider theme={theme}>
            <AdminLogin/>
        </ThemeProvider>
    </StyledEngineProvider>,
    document.getElementById('admins-login-component')
);
