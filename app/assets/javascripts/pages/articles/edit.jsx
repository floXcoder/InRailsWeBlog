'use strict';

require('../common');

const ArticleEdit = require('../../components/articles/edit');

const article = JSON.parse(document.getElementById('article-edit-component').getAttribute('data-article'));

ReactDOM.render(
    <ArticleEdit article={article.article}/>,
    document.getElementById('article-edit-component')
);
