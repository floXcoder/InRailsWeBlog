'use strict';

var ArticleActions = Reflux.createActions([
    'initStore',
    'loadArticles',
    'loadNextArticles',
    'loadArticlesByTag',
    'addArticle',
    'updateArticle',
    'deleteArticle',
    'filterArticlesByTag',
    'searchArticles',
    'autosaveArticle',
    'autocompleteArticles',
    'loadArticleHistory',
    'bookmarkArticle',
    'restoreArticle',
    'addComment',
    'updateComment',
    'deleteComment',
    'trackClick',
    'trackView'
]);

module.exports = ArticleActions;
