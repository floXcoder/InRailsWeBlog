import PropTypes from 'prop-types';

import {
    StyledEngineProvider,
    ThemeProvider
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {
    Provider,
    ReactReduxContext
} from 'react-redux';

import I18n from '@js/modules/translations';

import {
    configureStore
} from '@js/stores/admin';

import ErrorBoundary from '@js/components/errors/boundary';

import AdminHeaderLayout from '@js/components/layouts/admin/header';
import AdminMainLayout from '@js/components/layouts/admin/main';
import AdminFooterLayout from '@js/components/layouts/admin/footer';

import theme from '@js/theme';


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
