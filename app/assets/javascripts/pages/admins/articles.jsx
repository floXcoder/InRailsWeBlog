'use strict';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';

import '../../../stylesheets/pages/admins/articles.scss';

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
import AdminArticles from '../../components/admins/articles';

import theme from '../../../jss/theme';

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <Provider store={configureStore}>
            <AdminLayout>
                <AdminArticles/>
            </AdminLayout>
        </Provider>
    </MuiThemeProvider>,
    document.getElementById('admins-articles-component')
);
