'use strict';

import api from '../middlewares/api';

import {
    hasLocalStorage,
    saveLocalArray,
    getLocalData
} from '../middlewares/localStorage';

import {
    recentLocalStorage
} from '../components/modules/constants';

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
    if (process.env.NODE_ENV !== 'production' || window.seoMode) {
        return;
    }

    return api
        .post(`/api/v1/${elementName}s/${elementId}/viewed`,
            {
                id: elementId
            });
};

export const spyTrackClick = (elementType, elementId, elementSlug, elementUserId, elementTitle, elementParentId) => {
    if (process.env.NODE_ENV !== 'production' || window.seoMode) {
        return new Promise((resolve) => {
            resolve();
        });
    }

    // Always save to local storage for optimization
    if (hasLocalStorage && elementSlug && elementTitle) {
        saveLocalArray(recentLocalStorage, {
            type: elementType,
            elementId: elementId,
            title: elementTitle.replace(/<.*?>(.*)<\/.*?>/g, '$1'),
            slug: elementSlug,
            date: Date.now(),
            userId: elementUserId,
            parentId: elementParentId
        });
    }

    // configureStore.dispatch({
    //     type: ActionTypes.USER_RECENTS,
    //     local: true,
    //     element: elementName,
    //     recents: []
    // });

    return api
        .post(`/api/v1/${elementType}s/${elementId}/clicked`,
            {
                id: elementId,
                userId: elementUserId,
                parentId: elementParentId
            });
};

export const getTracksClick = (remove = false) => {
    return getLocalData(recentLocalStorage, remove);
};
