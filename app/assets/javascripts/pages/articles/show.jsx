'use strict';

require('../common');

var ArticleShow = require('../../components/articles/show');
var ArticleCreation = require('../../components/articles/creation');

var currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);
var article = JSON.parse(document.getElementById('article-element-component').getAttribute('data-article'));
var tags = JSON.parse(document.getElementById('article-element-component').getAttribute('data-tags'));

// Main
if(currentUserId) {
    ReactDOM.render(
        <ArticleCreation currentUserId={currentUserId} />,
        document.getElementById('article-creation-component')
    );
}

// Main
ReactDOM.render(
    <ArticleShow
        currentUserId={currentUserId}
        article={article.article}
        tags={tags} />,
    document.getElementById('article-element-component')
);
