'use strict';

import api from '../middlewares/api';


export const spyTrackView = (elementName, elementId) => {
    return api
        .sendBeacon(
            `/api/v1/${elementName}s/${elementId}/viewed`,
            {
                id: elementId
            }
        );
};

export const spyTrackClick = (elementType, elementId, elementSlug, elementUserId, elementTitle, elementParentId) => {
    return api
        .sendBeacon(
            `/api/v1/${elementType}s/${elementId}/clicked`,
            {
                id: elementId,
                userId: elementUserId,
                parentId: elementParentId
            }
        );
};
