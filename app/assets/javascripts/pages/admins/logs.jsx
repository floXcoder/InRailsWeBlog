'use strict';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';

import '../../../stylesheets/pages/admins/logs.scss';

import '../common';

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
import AdminLogs from '../../components/admins/logs';

import theme from '../../../jss/theme';

const logFilename = document.getElementById('admins-logs-component').getAttribute('data-log-filename');
const environmentLog = JSON.parse(document.getElementById('admins-logs-component').getAttribute('data-environment-log'));
const jobLog = JSON.parse(document.getElementById('admins-logs-component').getAttribute('data-job-log'));
const cronLog = JSON.parse(document.getElementById('admins-logs-component').getAttribute('data-cron-log'));

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Provider store={configureStore}>
            <AdminLayout>
                <AdminLogs logFilename={logFilename}
                           environmentLog={environmentLog}
                           jobLog={jobLog}
                           cronLog={cronLog}/>
            </AdminLayout>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('admins-logs-component')
);

