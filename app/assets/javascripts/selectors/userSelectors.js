'use strict';

import {
    createSelector
} from 'reselect';

export const getIsPrimaryUser = () => (
    window.currentUserId === '1'
);

// Users
export const getUsers = createSelector(
    (state) => state.userState.users,
    (users) => users.toArray()
);

export const getUserMetaTags = createSelector(
    (state) => state.userState.metaTags,
    (metaTags) => metaTags.toJS()
);

export const getUserPagination = createSelector(
    (state) => state.userState.pagination,
    (pagination) => pagination.toJS()
);

export const getUser = createSelector(
    (state) => state.userState.user,
    (user) => user
);

// Current user
export const getCurrentUser = createSelector(
    (state) => state.userState.user,
    (user) => user
);

// User recents
export const getUserRecentTopics = createSelector(
    (state) => state.userState.recentTopics,
    (_, limit) => limit,
    (recentTopics, limit) => {
        return recentTopics.sort((a, b) => b.date - a.date).filter((recent) => !!recent.name).toArray().limit(limit);
    }
);
export const getUserRecentTags = createSelector(
    (state) => state.userState.recentTags,
    (recentTags, limit) => {
        return recentTags.sort((a, b) => b.date - a.date).filter((recent) => !!recent.name).toArray().limit(limit);
    }
);
export const getUserRecentArticles = createSelector(
    (state) => state.userState.recentArticles,
    (recentArticles, limit) => {
        return recentArticles.sort((a, b) => b.date - a.date).filter((recent) => !!recent.title).toArray().limit(limit);
    }
);

export const getUserRecents = createSelector(
    (state) => state.userState.recentTags,
    (state) => state.userState.recentArticles,
    (_, limit) => limit,
    (tags, articles, limit) => {
        let recents = [];

        tags.map((tag) => {
            recents.push({
                type: 'tag',
                title: tag.name,
                slug: tag.slug,
                date: tag.date
            })
        });

        articles.map((article) => {
            recents.push({
                type: 'article',
                title: article.title,
                slug: article.slug,
                date: article.date
            })
        });

        recents.sort((a, b) => b.date - a.date);

        recents = recents.limit(limit);

        recents = recents.filter((recent) => !!recent.title || !!recent.name);

        return recents;
    }
);
