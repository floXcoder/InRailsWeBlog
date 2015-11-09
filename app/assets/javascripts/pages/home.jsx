require('./common');

var ArticleBox = require('../components/articles/box');
var ArticleCreation = require('../components/articles/creation');
var ArticleActions = require('../actions/articleActions');

var currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);

ArticleActions.initStore({
    page: 1
});

// Main
if(currentUserId) {
    ReactDOM.render(
        <ArticleCreation userId={currentUserId} />,
        document.getElementById('article-creation-component')
    );
}

ReactDOM.render(
    <ArticleBox userId={currentUserId} />,
    document.getElementById('react-main')
);
