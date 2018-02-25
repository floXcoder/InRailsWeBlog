'use strict';

import {
    createSelector
} from 'reselect';

// User connection
export const getIsOwner = (state, userId) => (
    state.userState.isConnected && state.userState.currentId === userId
);

export const getIsPrimaryUser = () => (
    window.currentUserId === '1'
);

// Users
export const getUsers = createSelector(
    (state) => state.userState.users,
    (users) => users.toArray()
);

export const getUserPagination = createSelector(
    (state) => state.userState.pagination,
    (pagination) => pagination.toJS()
);

export const getUser = createSelector(
    (state) => state.userState.user,
    (user) => user ? user.toJS() : {}
);

// Current user
export const getCurrentUser = createSelector(
    (state) => state.userState.user,
    (user) => user
);

// User recents
export const getUserRecentTopics = createSelector(
    (state) => state.userState.recentTopics,
    (recentTopics) => recentTopics.toArray()
);
export const getUserRecentTags = createSelector(
    (state) => state.userState.recentTags,
    (recentTags) => recentTags.toArray()
);
export const getUserRecentArticles = createSelector(
    (state) => state.userState.recentArticles,
    (recentArticles) => recentArticles.toArray()
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

        recents = recents.filter((recent) => !!recent.title);

        return recents;
    }
);
