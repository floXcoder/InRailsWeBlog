require('../common');

var ArticleElement = require('../../components/articles/element');
var ArticleCreation = require('../../components/articles/creation');

var currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);

// Main
if(currentUserId) {
    ReactDOM.render(
        <ArticleCreation userId={currentUserId} />,
        document.getElementById('article-creation-component')
    );
}

// Main
ReactDOM.render(
    <ArticleElement
        userId={currentUserId}
        article={JSON.parse(document.getElementById('article-element-component').getAttribute('data-article'))}
        tags={JSON.parse(document.getElementById('article-element-component').getAttribute('data-tags'))} />,
    document.getElementById('article-element-component')
);
