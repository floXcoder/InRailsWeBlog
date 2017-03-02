'use strict';

import '../common';

import ArticleEdit from '../../components/articles/edit';

const article = JSON.parse(document.getElementById('article-edit-component').getAttribute('data-article'));

ReactDOM.render(
    <ArticleEdit article={article.article}/>,
    document.getElementById('article-edit-component')
);
