'use strict';

import {
    createSelector
} from 'reselect';

import {
    getLocalData
} from '../middlewares/localStorage';

export const getIsPrimaryUser = () => (
    window.currentUserId === '1'
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
    (recentTopics, limit) => recentTopics.filter((recent) => !!recent.name).limit(limit)
);
export const getUserRecentTags = createSelector(
    (state) => state.userState.recentTags,
    () => getLocalData('recents')?.filter((recent) => recent.type === 'tag'),
    (_, limit) => limit,
    (recentTags, recentLocalTags, limit) => {
        recentLocalTags = recentLocalTags?.sort((a, b) => b.dateTimestamp - a.dateTimestamp)?.map((recentTag) => ({
            id: recentTag.elementId,
            name: recentTag.title,
            slug: recentTag.slug,
            topicIds: [recentTag.parentId]
        })) || [];

        return Utils.uniqValues(recentLocalTags.concat(recentTags).filter((recent) => !!recent.name), 'id').limit(limit);
    }
);
export const getUserRecentArticles = createSelector(
    (state) => state.userState.recentArticles,
    () => getLocalData('recents')?.filter((recent) => recent.type === 'article'),
    (_, limit) => limit,
    (recentArticles, recentLocalArticles, limit) => {
        recentLocalArticles = recentLocalArticles?.sort((a, b) => b.dateTimestamp - a.dateTimestamp)?.map((recentArticle) => ({
            id: recentArticle.elementId,
            title: recentArticle.title,
            slug: recentArticle.slug,
            topicId: recentArticle.parentId,
            user: {
                slug: recentArticle.userSlug
            }
        })) || [];

        return Utils.uniqValues(recentLocalArticles.concat(recentArticles).filter((recent) => !!recent.title), 'id').limit(limit);
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
                date: tag.dateTimestamp
            })
        });

        articles.map((article) => {
            recents.push({
                type: 'article',
                title: article.title,
                slug: article.slug,
                date: article.dateTimestamp
            })
        });

        // Date from server is the creation date and not the activity date!
        recents = [...recents].sort((a, b) => b.dateTimestamp - a.dateTimestamp);

        recents = recents.limit(limit);

        recents = recents.filter((recent) => !!recent.title || !!recent.name);

        return recents;
    }
);
