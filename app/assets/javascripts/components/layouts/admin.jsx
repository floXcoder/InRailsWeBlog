'use strict';

import {
    StyledEngineProvider,
    ThemeProvider
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {
    Provider,
    ReactReduxContext
} from 'react-redux';

import {
    configureStore
} from '../../stores/admin';

import ErrorBoundary from '../errors/boundary';

import AdminHeaderLayout from './admin/header';
import AdminMainLayout from './admin/main';
import AdminFooterLayout from './admin/footer';

import theme from '../../theme';


const AdminLayout = function ({componentId, children}) {
    return (
        <StyledEngineProvider injectFirst={true}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>

                <Provider store={configureStore}
                          context={ReactReduxContext}>
                    <div className="admin-root">
                        <ErrorBoundary errorType="text"
                                       errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                            <AdminHeaderLayout/>
                        </ErrorBoundary>

                        <ErrorBoundary errorType="card">
                            <AdminMainLayout componentId={componentId}>
                                {children}
                            </AdminMainLayout>
                        </ErrorBoundary>

                        <ErrorBoundary errorType="text"
                                       errorTitle={I18n.t('js.helpers.errors.boundary.footer')}>
                            <AdminFooterLayout/>
                        </ErrorBoundary>
                    </div>
                </Provider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

AdminLayout.propTypes = {
    componentId: PropTypes.string,
    children: PropTypes.object
};

export default AdminLayout;
