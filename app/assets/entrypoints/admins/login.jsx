import {createRoot} from 'react-dom/client';

import {
    ThemeProvider,
    StyledEngineProvider
} from '@mui/material/styles';

import theme from '@js/theme';

import AdminLogin from '@js/components/admins/login';

if (process.env.NODE_ENV === 'production') {
    require('@js/production');
} else {
    require('@js/development');
}

const root = createRoot(document.getElementById('admins-login-component'));
root.render(
    <StyledEngineProvider injectFirst={true}>
        <ThemeProvider theme={theme}>
            <AdminLogin/>
        </ThemeProvider>
    </StyledEngineProvider>
);
