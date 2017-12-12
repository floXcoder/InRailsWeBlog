'use strict';

import {
    createSelector
} from 'reselect';

export const getArticles = createSelector(
    (state) => state.articleState.articles,
    (articles) => articles.toArray()
);

export const getArticleIsOutdated = (article) => (
    article.outdatedNumber > 3
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
