require('./common');
var ArticleBox = require('../components/articles/box');
var AssociatedTagBox = require('../components/tags/associatedBox');
var IndexTagBox = require('../components/tags/indexBox');

React.render(
    <ArticleBox/>,
    document.getElementById('react-main')
);

React.render(
    <AssociatedTagBox/>,
    document.getElementById('sidebar-associated-tags')
);

React.render(
    <IndexTagBox/>,
    document.getElementById('sidebar-index-tags')
);
