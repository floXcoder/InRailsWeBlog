require('../common');
require('../../components/user/navigation');

var ArticleBox = require('../../components/articles/box');
var ArticleCreation = require('../../components/articles/creation');

// Main
ReactDOM.render(
    <ArticleCreation
        userId={window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10)}/>,
    document.getElementById('article-creation-component')
);

ReactDOM.render(
    <ArticleBox
        userId={window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10)}/>,
    document.getElementById('react-main')
);


