'use strict';

import _ from 'lodash';

import api from '../middlewares/api';

import {
    hasLocalStorage,
    saveLocalData,
    getLocalData
} from '../middlewares/localStorage';

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

const sendViewTimer = 2000;
const elementsViewed = {};
const sendTrackView = _.debounce((elementsViewed) => {
    Object.keys(elementsViewed).forEach((elementName) => {
        api.post(`/api/v1/${elementName}s/viewed`,
            {
                ids: elementsViewed[elementName]
            });
        elementsViewed[elementName] = [];
    });
}, sendViewTimer);
export const spyTrackView = (elementName, elementId) => {
    if (process.env.NODE_ENV === 'production') {
        elementsViewed[elementName] = (elementsViewed[elementName] || []).concat(elementId);
        sendTrackView(elementsViewed);
    }
};

export const spyTrackClick = (elementName, elementId, elementSlug = null, elementTitle = null) => {
    if (hasLocalStorage && elementSlug && elementTitle) {
        saveLocalData('recents', {
            type: elementName,
            elementId: elementId,
            title: elementTitle.replace(/<.*?>(.*)<\/.*?>/g, '$1'),
            slug: elementSlug,
            date: Date.now(),
            userId: window.currentUserId ? parseInt(window.currentUserId, 10) : undefined,
            parentId: window.currentUserTopicId ? parseInt(window.currentUserTopicId, 10) : undefined
        });
    }

    return api
        .post(`/api/v1/${elementName}s/${elementId}/clicked`,
            {
                id: elementId,
                userId: window.currentUserId ? parseInt(window.currentUserId, 10) : undefined,
                parentId: window.currentUserTopicId ? parseInt(window.currentUserTopicId, 10) : undefined
            });
};

export const getTracksClick = (remove = false) => {
    return getLocalData('recents', remove);
};
