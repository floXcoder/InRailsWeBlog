import {createRoot} from 'react-dom/client';

import {
    ThemeProvider,
    StyledEngineProvider
} from '@mui/material/styles';

import theme from '@js/theme';

import AdminLogin from '@js/components/admins/login';


const root = createRoot(document.getElementById('admins-login-component'));
root.render(
    <StyledEngineProvider injectFirst={true}>
        <ThemeProvider theme={theme}>
            <AdminLogin/>
        </ThemeProvider>
    </StyledEngineProvider>
);
