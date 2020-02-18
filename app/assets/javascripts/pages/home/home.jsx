'use strict';

import '../../../stylesheets/pages/home/home.scss';

I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

require('../../translations/home-' + I18n.locale);

import '../common';

require('../../modules/cookieChoices');

import ApplicationLayoutHome from '../../components/layouts/home/application';

ReactDOM.render(
    <ApplicationLayoutHome/>,
    document.getElementById('home-component')
);
