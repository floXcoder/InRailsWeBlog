require('../common');

var ArticleEdit = require('../../components/articles/edit');

var currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);
var article = JSON.parse(document.getElementById('article-element-component').getAttribute('data-article'));
var multiLanguage = (document.getElementById('article-element-component').getAttribute('data-multiLanguage') === 'true');

ReactDOM.render(
    <ArticleEdit
        userId={currentUserId}
        article={article.article}
        multiLanguage={multiLanguage} />,
    document.getElementById('article-element-component')
);
