'use strict';

import '../common';

import ArticleShow from '../../components/articles/show';

const article = JSON.parse(document.getElementById('article-show-component').getAttribute('data-article'));

// Main
ReactDOM.render(
    <ArticleShow article={article ? article.article : null}/>,
    document.getElementById('article-show-component')
);
