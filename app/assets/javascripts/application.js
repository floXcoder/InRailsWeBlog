'use strict';

// jQuery
import 'jquery-ujs';

// Materialize
import './common/materialize';

// Expose global variables
import './modules/utils';

// Notifications
import 'expose-loader?Notification!./components/theme/notification';
// noinspection JSUnresolvedVariable
Notification = Notification.default;

// Translation
import 'expose-loader?I18n!imports-loader?this=>window!./modules/i18n';
I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

// Keyboard inputs
import 'expose-loader?Mousetrap!mousetrap';

// Declare Module Helpers
// TODO: use redux global state instead of $app
// import 'expose-loader?$app!./modules/app';
// // noinspection JSUnresolvedVariable
// $app = $app.default;

// TODO
// if (process.env.NODE_ENV !== 'production') {
//     const {whyDidYouUpdate} = require('why-did-you-update');
//     whyDidYouUpdate(React);
//     // whyDidYouUpdate(React, { exclude: /^(?=EnhancedButton|FlatButton)/ });
// }

// Configure log level
if (window.railsEnv === 'development') {
    log.setLevel('info');
    const screenLog = require('./modules/screenLog').default;
    screenLog.init({freeConsole: true});
    log.now = function (data, colorStyle) {
        screenLog.log(data, colorStyle);
    };
} else {
    log.setLevel('warn');
    log.now = function () {
    };
}

log.table = function (data) {
    console.table(data);
};

// TODO
// // Error management
// import ErrorStore from './stores/errorStore';
// window.onerror = function (message, url, lineNumber, columnNumber, trace) {
//     try {
//         const reactRootComponent = document.getElementsByClassName('react-root');
//
//         if (reactRootComponent[0]) {
//             // Test if React component
//             if (!ReactDOM.findDOMNode(reactRootComponent[0]).children[0]) {
//                 Notification.alert(I18n.t('js.helpers.errors.frontend'), 300, I18n.t('js.helpers.home'), () => window.location = '/');
//             }
//         }
//     }
//     catch (e) {
//         // Root node is not a React component so React is not mounted
//         Notification.alert(I18n.t('js.helpers.errors.frontend'), 300, I18n.t('js.helpers.home'), () => window.location = '/');
//     }
//
//     if (!trace) {
//         trace = {};
//     }
//
//     ErrorStore.pushError({
//         message: message,
//         url: url,
//         lineNumber: lineNumber,
//         columnNumber: columnNumber,
//         trace: trace.stack,
//         origin: 'client'
//     });
//
//     if (window.railsEnv === 'development') {
//         log.now('Error: ' + message + ' (File: ' + url + ' ; ' + lineNumber + ')', 'text-error');
//     }
// };

// IE10 viewport hack for Surface/desktop Windows 8 bug
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    const msViewportStyle = document.createElement('style');
    msViewportStyle.appendChild(
        document.createTextNode(
            '@-ms-viewport{width:auto!important}'
        )
    );
    document.querySelector('head').appendChild(msViewportStyle);
}
