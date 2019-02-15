'use strict';

import {
    createSelector
} from 'reselect';

import {
    getSortedTopicTags
} from './tagSelectors';

const articlesByTag = (articles, sortedTags, parentTag) => {
    let orderedArticles = {};

    if (!parentTag) {
        sortedTags.forEach((tag) => {
            orderedArticles[tag.name] = []
        });
    }

    if(Utils.isEmpty(orderedArticles)) {
        return orderedArticles;
    }

    articles.forEach((article) => {
        const parentTagNames = sortedTags.map((tag) => tag.name);

        if (parentTag) {
            // Tag articles view
            let firstArticleTag = article.tags.filter((tag) => !parentTagNames.includes(tag.name)).map((tag) => tag.name).sort().first();
            firstArticleTag = firstArticleTag || 'undefined';
            orderedArticles[firstArticleTag] = orderedArticles[firstArticleTag] ? orderedArticles[firstArticleTag].concat(article) : [article];
        } else {
            // Topic or user articles view
            const firstArticleTag = article.tags.filter((tag) => parentTagNames.includes(tag.name)).map((tag) => tag.name).sort().first();
            // In case of previous articles are still in memory
            if(orderedArticles[firstArticleTag]) {
                orderedArticles[firstArticleTag].push(article);
            }
        }
    });

    return orderedArticles;
};

export const getArticleMetaTags = createSelector(
    (state) => state.articleState.metaTags,
    (metaTags) => metaTags.toJS()
);

export const getArticles = createSelector(
    (state) => state.articleState.articles,
    (articles) => articles.toArray()
);

export const getArticlesCount = createSelector(
    (state) => state.articleState.articles,
    (articles) => articles.size
);

export const getOrderedArticles = createSelector(
    (state) => state.articleState.articles,
    (state) => state.uiState.articleOrderMode,
    (state) => getSortedTopicTags(state),
    (_, props) => props.parentTag,
    (articles, articleOrderMode, sortedTags, parentTag) => {
        const isSortedByTag = articleOrderMode === 'tag_asc' || articleOrderMode === 'tag_desc';

        if (isSortedByTag) {
            return articlesByTag(articles, sortedTags, parentTag);
        } else {
            return articles.toArray();
        }
    }
);

export const getCategorizedArticles = createSelector(
    (state) => state.articleState.articles,
    (state) => state.uiState.articleOrderMode,
    (state) => getSortedTopicTags(state),
    (_, props) => props.parentTag,
    (articles, articleOrderMode, sortedTags) => {
        let categorizedArticles = {};

        if (articleOrderMode === 'updated_desc' || articleOrderMode === 'updated_asc') {
            articles.forEach((article) => {
                categorizedArticles[article.date] = categorizedArticles[article.date] ? categorizedArticles[article.date].concat(article) : [article];
            });
        } else if (articleOrderMode === 'tag_asc' || articleOrderMode === 'tag_desc') {
            categorizedArticles = articlesByTag(articles, sortedTags);
        } else {
            categorizedArticles['all_articles'] = [];
            articles.forEach((article) => {
                categorizedArticles['all_articles'].push(article);
            });
        }

        return categorizedArticles;
    }
);

export const getArticlePagination = createSelector(
    (state) => state.articleState.pagination,
    (pagination) => pagination.toJS()
);

export const getArticleStories = createSelector(
    (state) => state.articleState.articleStories,
    (articles) => articles && articles.toArray()
);

export const getArticleSiblingStories = createSelector(
    (state) => state.articleState.articleStories,
    (state) => state.articleState.article,
    (articles, article) => {
        if (articles && article) {
            const currentIndex = articles.findIndex((item) => item.id === article.id);
            if (currentIndex === 0) {
                return [
                    articles.get(1)
                ];
            } else if (currentIndex === articles.size - 1) {
                return [
                    articles.get(currentIndex - 1)
                ];
            } else {
                return [
                    articles.get(currentIndex - 1),
                    articles.get(currentIndex + 1)
                ];
            }
        } else {
            return null;
        }
    }
);

export const getHomeArticles = createSelector(
    (state) => state.articleState.homeArticles,
    (articles) => articles.toArray()
);

export const getPopularArticles = createSelector(
    (state) => state.articleState.popularArticles,
    (articles) => articles.toArray()
);

export const getArticle = createSelector(
    (state) => state.articleState.article,
    (article) => article
);

export const getArticleIsOwner = (state, article) => {
    if (article) {
        if (state.topicState.contributedTopics.find((topic) => topic.id === article.topicId)) {
            return true;
        }

        if (article.user) {
            return state.userState.currentId === article.user.id;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

export const getArticleParentTags = createSelector(
    (article) => article,
    (article) => {
        // If tags and no parents, set as parent tags for display
        const hasParentSlugs = article && article.parentTagSlugs && article.parentTagSlugs.length > 0;
        const hasParentIds = article && article.parentTagIds && article.parentTagIds.length > 0;
        const tags = article && article.tags && article.tags.filter((tag) => {
            if (hasParentSlugs) {
                return article.parentTagSlugs.includes(tag.slug);
            } else if (hasParentIds) {
                return article.parentTagIds.includes(tag.id);
            } else {
                return true;
            }
        });

        // Use isImmutable function in new version
        if (tags && tags.size !== undefined) {
            return tags.toArray();
        } else {
            return tags;
        }
    }
);

export const getArticleChildTags = createSelector(
    (article) => article,
    (article) => {
        const tags = article && article.tags && article.tags.filter((tag) => (
            article.childTagSlugs ? article.childTagSlugs.includes(tag.slug) : article.childTagIds && article.childTagIds.includes(tag.id)
        ));

        // Use isImmutable in new version
        if (tags && tags.size !== undefined) {
            return tags.toArray();
        } else {
            return tags;
        }
    }
);

export const getArticleErrors = createSelector(
    (state) => state.articleState.errors,
    (errors) => {
        let errorContent = [];
        if (typeof errors === 'string') {
            errorContent = [errors];
        } else {
            errors.mapKeys((errorName, errorDescriptions) => {
                errorDescriptions = errorDescriptions.toJS();
                errorContent.push(I18n.t(`js.article.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
            }).toArray();
        }
        return errorContent;
    }
);

export const getArticleVersions = createSelector(
    (state) => state.articleState.articleVersions,
    (articleVersions) => articleVersions && articleVersions.toJS()
);
