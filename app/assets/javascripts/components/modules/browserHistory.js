'use strict';

import {
    createBrowserHistory
} from 'history';

import ReactPiwik from 'react-piwik';

import {
    trackAction
} from '../../actions';

let browserHistory = createBrowserHistory();

if (window._paq && !window.seoMode) {
    const piwik = new ReactPiwik({
        url: window.METRICS_ADDRESS,
        siteId: window.METRICS_SITE_NUMBER,
        jsFilename: window.METRICS_FILENAME + '.js',
        phpFilename: window.METRICS_FILENAME + '.php'
    });

    ReactPiwik.push(['trackPageView']);

    if (window.currentUserId) {
        ReactPiwik.push(['setUserId', window.currentUserId]);
    }

    browserHistory = piwik.connectToHistory(browserHistory, true);
}

// Validate user visit
function trackData(loc) {
    setTimeout(function () {
        const params = {
            // action_name: name,
            // properties: properties || {},
            // time: (new Date()).getTime() / 1000.0,
            url: window.location.href,
            title: document.title,
            path: window.location.pathname,
            locale: window.locale
        };

        trackAction(params);
    }, 150);
}

function connectToHistory(history) {
    const initialLocation = (typeof history.getCurrentLocation === 'undefined') ? history.location : history.getCurrentLocation();
    const initialPath = initialLocation.path || (initialLocation.pathname + initialLocation.search).replace(/^\//, '');
    trackData(initialPath);

    const unlistenFromHistory = history.listen((location) => {
        trackData(location);
    });
}

connectToHistory(browserHistory)


export default browserHistory;
