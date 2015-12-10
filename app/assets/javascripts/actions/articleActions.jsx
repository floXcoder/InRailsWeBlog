'use strict';

// An automatic function invocation is done then, the function with the same name or one with the 'on' prefix is getting invoked on the Store. So, in our case it's either 'fetchArticles()' or 'onfetchArticles()'.
// whenever the action 'fetchList' is invoked, the 'fetchArticles()' function of ImageStore gets called.
var ArticleActions = Reflux.createActions([
    'initStore',
    'loadArticles',
    'loadNextArticles',
    'loadArticlesByTag',
    'pushArticles',
    'updateArticles',
    'deleteArticles',
    'filterArticlesByTag',
    'searchArticles',
    'autocompleteArticles',
    'loadArticleHistory',
    'bookmarkArticle',
    'restoreArticle',
    'commentArticle',
    'updateCommentArticle',
    'deleteCommentArticle'
]);

//ArticleActions.fetchArticles.preEmit = function() { console.log('fetchArticles'); };

module.exports = ArticleActions;
