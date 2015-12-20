'use strict';

require('../common');

var ArticleIndex = require('../../components/articles/index');
var ArticleCreation = require('../../components/articles/creation');
var ArticleActions = require('../../actions/articleActions');

var currentUserId = (window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10));

ArticleActions.initStore({
    page: 1,
    userId: document.getElementById('article-box-component').dataset.userId,
    pseudo: document.getElementById('article-box-component').dataset.userPseudo,
    mode: document.getElementById('article-box-component').dataset.mode
});

// Main
ReactDOM.render(
    <ArticleCreation currentUserId={currentUserId} />,
    document.getElementById('article-creation-component')
);

ReactDOM.render(
    <ArticleIndex currentUserId={currentUserId} />,
    document.getElementById('article-box-component')
);


