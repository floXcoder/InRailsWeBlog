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

export const getArticleIsOwner = (state) => (
    !!state.articleState.article && state.userState.currentId === state.articleState.article.user.id
);

export const getArticleIsOutdated = (article) => (
    article && article.outdatedNumber > 3
);

// TODO
export const getArticleErrors = createSelector(
    (state) => state.articleState.errors,
    (errors) => {

        // if (articleData.type === 'addArticleError') {
        //     newState.articleErrors = Object.keys(articleData.articleErrors).map((errorName) => {
        //         let errorDescription = articleData.articleErrors[errorName];
        //         return I18n.t('js.article.model.' + errorName) + ' ' + errorDescription.join(I18n.t('js.helpers.and'));
        //     });
        // }

        let errorContent = [];
        errors.mapKeys((errorName, errorDescriptions) => {
            errorDescriptions = errorDescriptions.toJS();
            errorContent.push(I18n.t(`js.article.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
        });
        return errorContent;
    }
);

// TODO: useful ?
// export const getArticleContent = (stateArticles, id) => {
//     // TODO
//     // return isHighlightingResults && !$.isEmpty(article.highlight_content) ?
//     //     article.highlight_content :
//     //     article.content
//
//     return stateArticles.articles[id].content;
// };
