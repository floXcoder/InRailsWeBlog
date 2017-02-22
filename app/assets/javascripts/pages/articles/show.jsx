'use strict';

require('../common');

const ArticleShow = require('../../components/articles/show');

const article = JSON.parse(document.getElementById('article-show-component').getAttribute('data-article'));

// Main
ReactDOM.render(
    <ArticleShow article={article ? article.article : null}/>,
    document.getElementById('article-show-component')
);
