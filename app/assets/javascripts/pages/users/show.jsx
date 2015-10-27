require('../common');

var ArticleBox = require('../../components/articles/box');
var ArticleCreation = require('../../components/articles/creation');

var currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);

// Main
ReactDOM.render(
    <ArticleCreation userId={currentUserId} />,
    document.getElementById('article-creation-component')
);

ReactDOM.render(
    <ArticleBox userId={currentUserId} userConnected="true" />,
    document.getElementById('article-box-component')
);


