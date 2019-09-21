'use strict';

import '../../../stylesheets/pages/home/user.scss';

import '../common';

I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

require('../../translations/user-' + I18n.locale);

import ApplicationLayoutUser from '../../components/layouts/user/application';

ReactDOM.render(
    <ApplicationLayoutUser/>,
    document.getElementById('user-component')
);
