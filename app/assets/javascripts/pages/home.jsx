'use strict';

require('./common');

let ArticleIndex = require('../components/articles/index');
let ArticleCreation = require('../components/articles/creation');
let ArticleActions = require('../actions/articleActions');

let currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);

ArticleActions.initStore({
    page: 1
});

// Main
if(currentUserId) {
    ReactDOM.render(
        <ArticleCreation/>,
        document.getElementById('article-creation-component')
    );
}

ReactDOM.render(
    <ArticleIndex currentUserId={currentUserId}/>,
    document.getElementById('article-list-component')
);
