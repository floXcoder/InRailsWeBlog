'use strict';

import '../../../stylesheets/pages/home/home.scss';

window.I18n.defaultLocale = window.defaultLocale;
window.I18n.locale = window.locale;

require('imports-loader?this=>window!../../modules/i18n');

require('../common');

require('../../modules/cookieChoices');

import ApplicationLayoutHome from '../../components/layouts/home/application';

ReactDOM.render(
    <ApplicationLayoutHome/>,
    document.getElementById('home-component')
);
