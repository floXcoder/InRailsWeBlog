'use strict';

require('../common');

var ArticleIndex = require('../../components/articles/index');
var ArticleCreation = require('../../components/articles/new');
var ArticleActions = require('../../actions/articleActions');

ArticleActions.initStore({
    page: 1,
    userId: document.getElementById('article-box-component').dataset.userId,
    pseudo: document.getElementById('article-box-component').dataset.userPseudo,
    mode: document.getElementById('article-box-component').dataset.mode
});

// Main
ReactDOM.render(
    <ArticleCreation />,
    document.getElementById('article-new-component')
);

ReactDOM.render(
    <ArticleIndex />,
    document.getElementById('article-box-component')
);


