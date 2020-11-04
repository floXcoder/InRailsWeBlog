'use strict';

import {
    createBrowserHistory
} from 'history';

import ReactPiwik from 'react-piwik';

let browserHistory = createBrowserHistory();

if (window._paq && !window.seoMode) {
    const piwik = new ReactPiwik({
        url: window.METRICS_ADDRESS,
        siteId: window.METRICS_SITE_NUMBER,
        jsFilename: window.METRICS_FILENAME + '.js',
        phpFilename: window.METRICS_FILENAME + '.php'
    });

    ReactPiwik.push(['trackPageView']);

    if(window.currentUserId) {
        ReactPiwik.push(['setUserId', window.currentUserId]);
    }

    browserHistory = piwik.connectToHistory(browserHistory);
}

export default browserHistory;
