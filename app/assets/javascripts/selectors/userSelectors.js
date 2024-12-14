
import {
    createSelector
} from 'reselect';

export const getIsPrimaryUser = () => (
    window.currentUserId === '1'
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
export const getUserRecentUpdatedArticles = createSelector(
    (state) => state.userState.recentUpdatedArticles,
    (_, limit) => limit,
    (recentUpdatedArticles, limit) => recentUpdatedArticles.limit(limit)
);
