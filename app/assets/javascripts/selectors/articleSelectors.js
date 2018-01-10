'use strict';

import {
    createSelector
} from 'reselect';

export const getArticles = createSelector(
    (state) => state.articleState.articles,
    (articles) => articles.toArray()
);
export const getArticlePagination = createSelector(
    (state) => state.articleState.pagination,
    (pagination) => pagination.toJS()
);

export const getArticleIsOwner = (state, article) => (
    article ? state.userState.currentId === article.user.id : false
);

export const getArticleIsOutdated = (article) => (
    article ? article.outdatedNumber > 3 : false
);

export const getArticleParentTags = createSelector(
    (article) => article,
    (article) => article && article.tags.map((tag) => (
        article.parentTagIds.includes(tag.id)
    ))
);

export const getArticleChildTags = createSelector(
    (article) => article,
    (article) => article && article.tags.map((tag) => (
        article.childTagIds.includes(tag.id)
    ))
);

export const getArticleErrors = createSelector(
    (state) => state.articleState.errors,
    (articleErrors) => {
        let errorContent = [];
        if (typeof articleErrors === 'string') {
            errorContent = [articleErrors];
        } else {
            articleErrors.mapKeys((errorName, errorDescriptions) => {
                errorDescriptions = errorDescriptions.toJS();
                errorContent.push(I18n.t(`js.article.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
            }).toArray();
        }
        return errorContent;
    }
);

// TODO: useful ?
// export const getArticleContent = (stateArticles, id) => {
//     // return isHighlightingResults && !$.isEmpty(article.highlight_content) ?
//     //     article.highlight_content :
//     //     article.content
//
//     return stateArticles.articles[id].content;
// };
