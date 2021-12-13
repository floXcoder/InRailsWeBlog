'use strict';

import ReactPiwik from 'react-piwik';

import api from '../middlewares/api';


window.trackingDatas = {};

let piwik;
if (window._paq && !window.seoMode) {
    piwik = new ReactPiwik({
        url: window.METRICS_ADDRESS,
        siteId: window.METRICS_SITE_NUMBER,
        jsFilename: window.METRICS_FILENAME + '.js',
        phpFilename: window.METRICS_FILENAME + '.php'
    });
}

export const trackMetrics = (location) => {
    if (piwik) {
        piwik.track(location);
    }
};

export const trackAction = (params, actionType) => {
    if (GlobalEnvironment.NODE_ENV !== 'production' || window.seoMode) {
        return;
    }

    const pathname = params.pathname;

    // Ensure components are loaded and title updated
    setTimeout(() => {
        if (actionType === 'route' && (window.trackingData || window.trackingDatas[params.pathname])) {
            const {action, ...trackingParams} = window.trackingData || window.trackingDatas[params.pathname];
            const {metaTags, ...trackingData} = trackingParams;

            params = {
                action: action || 'page_visit',
                url: window.location.href,
                title: metaTags.title || document.title,
                locale: window.locale,
                ...trackingData
            };

            if (window.trackingData) {
                window.trackingDatas[pathname] = window.trackingData;

                window.trackingData = undefined;
            }

            return api
                .post('/api/v1/tracker/action', {
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
            .post('/api/v1/tracker/action', {
                tracker: params
            });
    }, 50);
};

export const spySearchResults = (searchParams, response) => {
    if (window._paq && !window.seoMode) {
        const keywords = [searchParams.query, searchParams.location?.place_name].compact().join(', ');
        let totalResults = 0;
        for (const resultType in response.totalCount) {
            if (response.totalCount.hasOwnProperty(resultType)) {
                totalResults += response.totalCount[resultType];
            }
        }

        window._paq.push(['trackSiteSearch', keywords, 'Search', totalResults]);
    }
};

export const spyTrackView = (elementName, elementId) => {
    if (GlobalEnvironment.NODE_ENV !== 'production' || window.seoMode) {
        return;
    }

    return api
        .post(
            `/api/v1/${elementName}s/${elementId}/viewed`,
            {
                id: elementId
            }
        );
};

export const spyTrackClick = (elementType, elementId, elementSlug, elementUserId, elementTitle, elementParentId) => {
    if (GlobalEnvironment.NODE_ENV !== 'production' || window.seoMode) {
        return new Promise((resolve) => {
            resolve();
        });
    }

    return api
        .post(
            `/api/v1/${elementType}s/${elementId}/clicked`,
            {
                id: elementId,
                userId: elementUserId,
                parentId: elementParentId
            }
        );
};

// Unused for now
// export const spyHeartbeat = (value) => {
//     if (window._paq) {
//         window._paq.push(['enableHeartBeatTimer', value]);
//     }
// };
//
// export const spyWaypoint = (eventName, positionName) => {
//     if (window._paq) {
//         window._paq.push(['trackEvent', eventName, positionName]);
//     }
// };
//
// export const spySearchForm = (type) => () => {
//     setTimeout(() => {
//         if (window._paq) {
//             window._paq.push(['trackEvent', 'Search form', type]);
//         }
//     }, 50);
// };
