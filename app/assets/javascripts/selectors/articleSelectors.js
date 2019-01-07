'use strict';

import {
    createSelector
} from 'reselect';

export const getArticles = createSelector(
    (state) => state.articleState.articles,
    (articles) => articles.toArray()
);

export const getArticleMetaTags = createSelector(
    (state) => state.articleState.metaTags,
    (metaTags) => metaTags.toJS()
);

export const getArticlePagination = createSelector(
    (state) => state.articleState.pagination,
    (pagination) => pagination.toJS()
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

export const getArticleIsOwner = (state, article) => (
    article && article.user ? state.userState.currentId === article.user.id : false
);

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
