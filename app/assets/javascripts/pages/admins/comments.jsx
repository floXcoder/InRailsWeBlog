'use strict';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';

import '../../../stylesheets/pages/admins/comments.scss';

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
import AdminComments from '../../components/admins/comments';

import theme from '../../../jss/theme';

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Provider store={configureStore}>
            <AdminLayout>
                <AdminComments/>
            </AdminLayout>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('admins-comments-component')
);
