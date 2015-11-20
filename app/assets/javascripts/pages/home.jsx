"use strict";

require('./common');

var ArticleIndex = require('../components/articles/index');
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
    <ArticleIndex userId={currentUserId} />,
    document.getElementById('react-main')
);
