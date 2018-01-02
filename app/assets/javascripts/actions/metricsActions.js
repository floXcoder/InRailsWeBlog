'use strict';

import api from '../middlewares/api';

export const spyHeartbeat = (value) => {
    if (window._paq) {
        window._paq.push(['enableHeartBeatTimer', value]);
    }
};

export const spyWaypoint = (eventName, positionName) => {
    if (window._paq) {
        window._paq.push(['trackEvent', eventName, positionName]);
    }
};

export const spySearchForm = (type) => () => {
    setTimeout(() => {
        if (window._paq) {
            window._paq.push(['trackEvent', 'Search form', type]);
        }
    }, 50);
};

export const spySearchResults = (searchParams, response) => {
    if (window._paq) {
        const keywords = [searchParams.query, searchParams.location && searchParams.location.place_name].compact().join(', ');
        let totalResults = 0;
        for (const resultType in response.totalCount) {
            if (response.totalCount.hasOwnProperty(resultType)) {
                totalResults += response.totalCount[resultType];
            }
        }

        window._paq.push(['trackSiteSearch', keywords, 'Search', totalResults]);
    }
};

export const spyTrackView = (elementName, elementId, parentName = null, parentId = null) => {
    if (process.env.NODE_ENV === 'production') {
        return api
            .post((parentName && parentId)
                ? `/${parentName}s/${parentId}/${elementName}s/${elementId}/viewed`
                : `/${elementName}s/${elementId}/viewed`,
                {
                    id: elementId
                });
    }
};

export const spyTrackClick = (elementName, elementId, parentName = null, parentId = null) => {
    return api
        .post((parentName && parentId)
            ? `/${parentName}s/${parentId}/${elementName}s/${elementId}/clicked`
            : `/${elementName}s/${elementId}/clicked`,
            {
                id: elementId
            });
};
