'use strict';

import {
    createSelector
} from 'reselect';

export const getIsPrimaryUser = () => (
    window.currentUserId === '1'
);

// Current user
export const getCurrentUser = createSelector(
    (state) => state.userState.user,
    (user) => user
);

// User recents
export const getUserRecentTags = createSelector(
    (state) => state.userState.recentTags,
    (_, limit) => limit,
    (recentTags, limit) => recentTags.limit(limit)
);
export const getUserRecentArticles = createSelector(
    (state) => state.userState.recentArticles,
    (_, limit) => limit,
    (recentArticles, limit) => recentArticles.limit(limit)
);
