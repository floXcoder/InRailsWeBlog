require('../common');
require('../../components/user/navigation');

var ArticleElement = require('../../components/articles/element');

// Main
ReactDOM.render(
    <ArticleElement
        userId={window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10)}
        article={JSON.parse(document.getElementById('react-main').getAttribute('data-article'))}
        tags={JSON.parse(document.getElementById('react-main').getAttribute('data-tags'))} />,
    document.getElementById('react-main')
);
