import {
    createSelector
} from 'reselect';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

import {
    getSortedTopicTags
} from '@js/selectors/tagSelectors';

const articlesByTag = (articles, sortedTags, parentTagSlug) => {
    const orderedArticles = {};

    if (!parentTagSlug) {
        sortedTags.forEach((tag) => {
            orderedArticles[tag.name] = [];
        });
    }

    articles.forEach((article) => {
        const parentTagSlugs = sortedTags.map((tag) => tag.slug);

        if (parentTagSlug) {
            // Tag articles view
            let firstArticleTag = article.tags.filter((tag) => parentTagSlugs.includes(tag.slug))
                .map((tag) => tag.name)
                .sort()
                .first();
            firstArticleTag ||= 'undefined';
            orderedArticles[firstArticleTag] = orderedArticles[firstArticleTag] ? orderedArticles[firstArticleTag].concat(article) : [article];
        } else {
            // Topic or user articles view
            const firstArticleTag = article.tags.filter((tag) => parentTagSlugs.includes(tag.slug))
                .map((tag) => tag.name)
                .sort()
                .first();
            // In case of previous articles are still in memory
            if (orderedArticles[firstArticleTag]) {
                orderedArticles[firstArticleTag].push(article);
            }
        }
    });

    return orderedArticles;
};

export const getArticlesCurrentMode = createSelector(
    (state) => state.articleState.articles,
    (state) => state.topicState.currentTopic,
    (articles, currentTopic) => {
        if (currentTopic) {
            return currentTopic.mode;
        } else if (articles && articles.length > 0) {
            if (articles.every((article) => article.mode === 'story')) {
                return 'stories';
            } else if (articles.every((article) => article.mode === 'inventory')) {
                return 'inventories';
            }
        }
    }
);

export const getArticlesCount = createSelector(
    (state) => state.articleState.articles,
    (articles) => (articles ? articles.length : 0)
);

export const getOrderedArticles = createSelector(
    (state) => state.articleState.articles,
    (state) => state.uiState.articleOrderMode,
    (state) => getSortedTopicTags(state),
    (_, props) => props.parentTagSlug,
    (articles, articleOrderMode, sortedTags, parentTagSlug) => {
        const isSortedByTag = articleOrderMode === 'tag_asc' || articleOrderMode === 'tag_desc';

        if (isSortedByTag) {
            return articlesByTag(articles, sortedTags, parentTagSlug);
        } else {
            return articles;
        }
    }
);

export const getCategorizedArticles = createSelector(
    (state) => state.articleState.articles,
    (state) => state.uiState.articleOrderMode,
    (state) => getSortedTopicTags(state),
    (_, props) => props.parentTagSlug,
    (articles, articleOrderMode, sortedTags, parentTagSlug) => {
        let categorizedArticles = {};

        if (!articles) {
            return categorizedArticles;
        }

        if (articleOrderMode === 'created_asc' || articleOrderMode === 'created_desc') {
            articles.forEach((article) => {
                categorizedArticles[article.date] = categorizedArticles[article.date] ? categorizedArticles[article.date].concat(article) : [article];
            });
        } else if (articleOrderMode === 'updated_asc' || articleOrderMode === 'updated_desc') {
            articles.forEach((article) => {
                categorizedArticles[article.updatedDate] = categorizedArticles[article.updatedDate] ? categorizedArticles[article.updatedDate].concat(article) : [article];
            });
        } else if (articleOrderMode === 'tag_asc' || articleOrderMode === 'tag_desc') {
            categorizedArticles = articlesByTag(articles, sortedTags, parentTagSlug);
        } else if (articles) {
            categorizedArticles['all_articles'] = [];
            articles.forEach((article) => {
                categorizedArticles['all_articles'].push(article);
            });
        }

        return categorizedArticles;
    }
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
    (_, article) => article,
    (state) => state.tagState.currentTagSlugs,
    (state) => state.tagState.topicTags,
    (article, currentTagSlugs, topicTags) => {
        if (article && article.tags) {
            // If tags and no parents, set as parent tags for display
            const hasParentSlugs = article.parentTagSlugs && article.parentTagSlugs.length > 0;
            const hasParentIds = article.parentTagIds && article.parentTagIds.length > 0;

            return article.tags.filter((tag) => {
                if (hasParentSlugs) {
                    return article.parentTagSlugs.includes(tag.slug);
                } else if (hasParentIds) {
                    return article.parentTagIds.includes(tag.id);
                } else {
                    return true;
                }
            });
        } else if (currentTagSlugs?.length && topicTags?.length) {
            return topicTags.filter((tag) => currentTagSlugs.includes(tag.slug));
        }
    }
);

export const getArticleChildTags = createSelector(
    (article) => article,
    (article) => {
        if (article && article.tags) {
            return article.tags.filter((tag) => (
                article.childTagSlugs ? article.childTagSlugs.includes(tag.slug) : article.childTagIds && article.childTagIds.includes(tag.id)
            ));
        }
    }
);

export const getArticleErrors = createSelector(
    (state) => state.articleState.errors,
    (errors) => {
        let errorContent;
        if (typeof errors === 'string') {
            errorContent = [errors];
        } else if (Utils.isPresent(errors)) {
            errorContent = [];
            Object.entries(errors)
                .forEach(([errorName, errorDescriptions]) => {
                    if (Utils.isPresent(errorDescriptions)) {
                        errorContent.push(I18n.t(`js.article.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
                    }
                });
        }
        return errorContent;
    }
);

export const getIsTagError = createSelector(
    (state) => state.articleState.errors,
    (errors) => {
        const errorKeys = errors && Object.keys(errors);

        return errorKeys && errorKeys.length === 1 && errorKeys[0] === 'tagged_articles';
    }
);
