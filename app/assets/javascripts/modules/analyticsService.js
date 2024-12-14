
import ReactPiwik from 'react-piwik';

import api from '@js/middlewares/api';


const AnalyticsService = (function () {
    const AnalyticsServiceModel = {};
    let piwik;
    const trackingDatas = {};

    const _isMetricsAvailable = function () {
        return window.isMetricsEnabled;
    };

    const _onPageReady = function (callback) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            // call on next available tick
            setTimeout(callback, 1);
        } else {
            document.addEventListener('DOMContentLoaded', () => callback());
        }
    };

    const _trackEvent = function (eventAction, eventName, eventValue, eventValueData) {
        if (!_isMetricsAvailable()) {
            return;
        }

        window._paq.push(['trackEvent', eventAction, eventName, eventValue, eventValueData].filter(Boolean));
    };

    const _trackSearch = function (query, resultCount, searchCategory = false) {
        if (!_isMetricsAvailable()) {
            return;
        }

        window._paq.push(['trackSiteSearch', query, searchCategory, resultCount]);
    };

    const _isUniqPerSession = function (eventName) {
        const eventInSession = sessionStorage.getItem(`analytics-${eventName}`);

        if (eventInSession) {
            return false;
        } else {
            sessionStorage.setItem(eventName, 'true');
            return true;
        }
    };

    /* IInitialization
    ******************** */
    AnalyticsServiceModel.initialize = function () {
        if (!_isMetricsAvailable()) {
            return false;
        }

        piwik = new ReactPiwik({
            url: window.METRICS_ADDRESS,
            siteId: window.METRICS_SITE_NUMBER,
            jsFilename: window.METRICS_FILENAME + '.js',
            phpFilename: window.METRICS_FILENAME + '.php'
        });

        // Change how long a tab needs to be active to be counted as viewed in seconds
        // Requires a page to be actively viewed for 10 seconds for any heart beat request to be sent.
        window._paq.push(['enableHeartBeatTimer', 10]);

        return true;
    };

    /* Track user
    ******************** */
    AnalyticsServiceModel.trackMetrics = function (location) {
        if (!_isMetricsAvailable() || !piwik) {
            return;
        }

        // Ensure components are loaded and title updated
        _onPageReady(() => {
            piwik.track(location);
        }, 100);
    };

    AnalyticsServiceModel.trackAction = function (params, actionType) {
        // if (!_isMetricsAvailable() || !piwik) {
        //     return;
        // }

        const pathname = params.pathname;

        // Ensure components are loaded and title updated
        _onPageReady(() => {
            if (actionType === 'route' && (window.trackingData || trackingDatas[params.pathname])) {
                const {
                    action,
                    ...trackingParams
                } = window.trackingData || trackingDatas[params.pathname];
                const {
                    metaTags,
                    ...trackingData
                } = trackingParams;

                params = {
                    action: action || 'page_visit',
                    url: window.location.href,
                    title: metaTags.title || document.title,
                    locale: window.locale,
                    ...trackingData
                };

                if (window.trackingData) {
                    trackingDatas[pathname] = window.trackingData;

                    window.trackingData = undefined;
                }

                return api
                    .sendBeacon('/api/v1/tracker/action', {
                        tracker: params
                    });
            } else if (actionType === 'fetch' && params) {
                params = {
                    action: 'page_visit',
                    url: window.location.href,
                    title: document.title,
                    locale: window.locale,
                    ...params
                };
            } else if (actionType === 'route' && !window.trackingData) {
                return;
            }

            return api
                .sendBeacon('/api/v1/tracker/action', {
                    tracker: params
                });
        }, 100);
    };

    /* Inscription and connection
    ******************** */
    AnalyticsServiceModel.trackSignupPage = function () {
        if (!_isMetricsAvailable()) {
            return;
        }

        window._paq.push(['setCustomUrl', window.location.host + '/signup']);
        window._paq.push(['trackPageView', 'Signup']);
    };

    AnalyticsServiceModel.trackSignupSuccess = function (userId) {
        _trackEvent('Subscription', 'signup', userId);
    };

    AnalyticsServiceModel.trackLoginPage = function () {
        if (!_isMetricsAvailable()) {
            return;
        }

        window._paq.push(['setCustomUrl', window.location.host + '/login']);
        window._paq.push(['trackPageView', 'Login']);
    };

    AnalyticsServiceModel.trackLoginSuccess = function (userId) {
        _trackEvent('Subscription', 'login', userId);
    };

    /* Search
    ******************** */
    AnalyticsServiceModel.trackSearch = function (searchParams, result) {
        let totalResults = 0;
        Object.keys(result.totalCount || result)
            .forEach((countKey) => totalResults += (result.totalCount || result)[countKey]);

        _trackSearch(searchParams.query, totalResults, 'Search page');
    };

    /* Other pages
    ******************** */
    AnalyticsServiceModel.trackArticleComparePage = function (userSlug, articleSlug) {
        if (!_isMetricsAvailable()) {
            return;
        }

        window._paq.push(['setCustomUrl', window.location.host + `/users/${userSlug}/articles/${articleSlug}/compare-article`]);
        window._paq.push(['trackPageView', `Article compare (${articleSlug})`]);
    };

    AnalyticsServiceModel.trackArticleSharePage = function (userSlug, articleSlug) {
        if (!_isMetricsAvailable()) {
            return;
        }

        window._paq.push(['setCustomUrl', window.location.host + `/users/${userSlug}/articles/${articleSlug}/share-article`]);
        window._paq.push(['trackPageView', `Article compare (${articleSlug})`]);
    };

    AnalyticsServiceModel.trackTopicPersistencePage = function (userSlug) {
        if (!_isMetricsAvailable()) {
            return;
        }

        window._paq.push(['setCustomUrl', window.location.host + `/users/${userSlug}/new-topic`]);
        window._paq.push(['trackPageView', 'Topic persistence']);
    };

    AnalyticsServiceModel.trackTopicSharePage = function (userSlug, topicSlug) {
        if (!_isMetricsAvailable()) {
            return;
        }

        window._paq.push(['setCustomUrl', window.location.host + `/users/${userSlug}/topics/${topicSlug}/share-topic`]);
        window._paq.push(['trackPageView', `Share topic (${topicSlug})`]);
    };

    AnalyticsServiceModel.trackTopicSortPage = function (userSlug) {
        if (!_isMetricsAvailable()) {
            return;
        }

        window._paq.push(['setCustomUrl', window.location.host + `/users/${userSlug}/topics/sort-topic`]);
        window._paq.push(['trackPageView', 'Sort topics']);
    };


    /* PWA
    ******************** */
    AnalyticsServiceModel.trackPWAMode = function (mode) {
        if (_isUniqPerSession('pwa-mode')) {
            _trackEvent('PWA', 'PWA mode', mode);
        }
    };

    AnalyticsServiceModel.trackPWAInstalled = function () {
        _trackEvent('PWA', 'PWA installed');
    };

    AnalyticsServiceModel.trackPWAPrompt = function () {
        _trackEvent('PWA', 'PWA install requested');
    };

    return AnalyticsServiceModel;
})();

export default AnalyticsService;
