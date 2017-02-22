'use strict';

var ArticleActions = Reflux.createActions([
    'loadArticles',
    'searchArticles',
    'autocompleteArticles',
    'loadArticle',
    'addArticle',
    'updateArticle',
    'deleteArticle',
    'autosaveArticle',
    'loadArticleHistory',
    'bookmarkArticle',
    'voteArticle',
    'outdateArticle',
    'restoreArticle',
    'trackClick',
    'trackView'
]);

module.exports = ArticleActions;
