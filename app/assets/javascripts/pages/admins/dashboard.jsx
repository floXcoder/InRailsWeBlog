'use strict';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';

import '../../../stylesheets/pages/admins/dashboard.scss';

import {
    Provider
} from 'react-redux';

import {
    configureStore
} from '../../stores/admin';

window.I18n.defaultLocale = window.defaultLocale;
window.I18n.locale = window.locale;

require('imports-loader?this=>window!../../modules/i18n');

require('../common');

import AdminLayout from '../../components/admins/adminLayout';
import AdminDashboard from '../../components/admins/dashboard';

import theme from '../../../jss/theme';

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Provider store={configureStore}>
            <AdminLayout>
                <AdminDashboard/>
            </AdminLayout>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('admins-dashboard-component')
);
