'use strict';

import '../../../stylesheets/pages/home/user.scss';

window.I18n.defaultLocale = window.defaultLocale;
window.I18n.locale = window.locale;

require('imports-loader?this=>window!../../modules/i18n');

require('../common');

import ApplicationLayoutUser from '../../components/layouts/user/application';

ReactDOM.render(
    <ApplicationLayoutUser/>,
    document.getElementById('user-component')
);
