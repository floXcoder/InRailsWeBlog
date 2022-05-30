'use strict';

import '../../../stylesheets/pages/admin.scss';

import {
    ThemeProvider,
    StyledEngineProvider
} from '@mui/material/styles';

import theme from '../../theme';

import AdminLogin from '../../components/admins/login';

require('../common');

const root = ReactCreateRoot(document.getElementById('admins-login-component'));
root.render(
    <StyledEngineProvider injectFirst={true}>
        <ThemeProvider theme={theme}>
            <AdminLogin/>
        </ThemeProvider>
    </StyledEngineProvider>
);
