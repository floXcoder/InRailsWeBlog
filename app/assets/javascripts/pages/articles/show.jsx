'use strict';

require('../common');

var ArticleShow = require('../../components/articles/show');
var ArticleCreation = require('../../components/articles/creation');

let currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);
let article = JSON.parse(document.getElementById('article-element-component').getAttribute('data-article'));
let tags = JSON.parse(document.getElementById('article-element-component').getAttribute('data-tags'));

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
