'use strict';

import {
    configureStore
} from '../stores';

import api from '../middlewares/api';

import {
    hasLocalStorage,
    saveLocalArray,
    getLocalData
} from '../middlewares/localStorage';

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

export const spyTrackView = (elementName, elementId) => {
    return api
        .post(`/api/v1/${elementName}s/${elementId}/viewed`,
            {
                id: elementId
            });
};

export const spyTrackClick = (elementName, elementId, elementSlug = null, elementTitle = null) => {
    const currentUserId = configureStore.getState().userState.currentId;
    const currentUserTopicId = configureStore.getState().topicState.currentUserTopicId;

    if (!currentUserId && hasLocalStorage && elementSlug && elementTitle) {
        saveLocalArray('recents', {
            type: elementName,
            elementId: elementId,
            title: elementTitle.replace(/<.*?>(.*)<\/.*?>/g, '$1'),
            slug: elementSlug,
            date: Date.now(),
            userId: currentUserId,
            parentId: currentUserTopicId
        });
    }

    // configureStore.dispatch({
    //     type: ActionTypes.USER_RECENTS,
    //     local: true,
    //     element: elementName,
    //     recents: []
    // });

    return api
        .post(`/api/v1/${elementName}s/${elementId}/clicked`,
            {
                id: elementId,
                userId: currentUserId,
                parentId: currentUserTopicId
            });
};

export const getTracksClick = (remove = false) => {
    return getLocalData('recents', remove);
};
