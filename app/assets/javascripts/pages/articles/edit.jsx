require('../common');

var ArticleUpdate = require('../../components/articles/update');

// Main
ReactDOM.render(
    <ArticleUpdate
        userId={window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10)}
        multiLanguage={document.getElementById('react-main').getAttribute('data-multiLanguage') === 'true'}
        article={JSON.parse(document.getElementById('react-main').getAttribute('data-article'))} />,
    document.getElementById('react-main')
);
