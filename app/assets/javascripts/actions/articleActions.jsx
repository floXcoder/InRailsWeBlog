// An automatic function invocation is done then, the function with the same name or one with the 'on' prefix is getting invoked on the Store. So, in our case it's either 'fetchArticles()' or 'onfetchArticles()'.
// whenever the action 'fetchList' is invoked, the 'fetchArticles()' function of ImageStore gets called.
var ArticleActions = Reflux.createActions([
    'loadArticles',
    'loadNextArticles',
    'pushArticles',
    'updateArticles',
    'deleteArticles',
    'filterArticlesByTag',
    'searchArticles',
    'autocompleteArticles',
    'loadArticleHistory',
    'restoreArticle'
]);

//ArticleActions.fetchArticles.preEmit = function() { console.log('fetchArticles'); };

module.exports = ArticleActions;
