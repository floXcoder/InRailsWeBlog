require('../common');

var ArticleUpdate = require('../../components/articles/update');

var currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);

ReactDOM.render(
    <ArticleUpdate
        userId={currentUserId}
        article={JSON.parse(document.getElementById('article-element-component').getAttribute('data-article')).article}
        multiLanguage={document.getElementById('article-element-component').getAttribute('data-multiLanguage') === 'true'} />,
    document.getElementById('article-element-component')
);
