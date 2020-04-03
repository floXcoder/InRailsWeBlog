'use strict';

import '../../../stylesheets/pages/admins/logs.scss';

import '../common';

import {
    Provider
} from 'react-redux';

import {
    configureStore
} from '../../stores/admin';

I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

require('../../translations/admin-' + I18n.locale);

require('../common');

import AdminLayout from '../../components/admins/adminLayout';
import AdminLogs from '../../components/admins/logs';

const logFilename = document.getElementById('admins-logs-component').getAttribute('data-log-filename');
const environmentLog = JSON.parse(document.getElementById('admins-logs-component').getAttribute('data-environment-log'));
const jobLog = JSON.parse(document.getElementById('admins-logs-component').getAttribute('data-job-log'));
const cronLog = JSON.parse(document.getElementById('admins-logs-component').getAttribute('data-cron-log'));

ReactDOM.render(
    <Provider store={configureStore}>
        <AdminLayout>
            <AdminLogs logFilename={logFilename}
                       environmentLog={environmentLog}
                       jobLog={jobLog}
                       cronLog={cronLog}/>
        </AdminLayout>
    </Provider>,
    document.getElementById('admins-logs-component')
);

