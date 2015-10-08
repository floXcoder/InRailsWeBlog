require('../common');
var ArticleBox = require('../../components/articles/box');
var AssociatedTagBox = require('../../components/tags/associatedBox');
var IndexTagBox = require('../../components/tags/indexBox');
var UserDisplay = require('../../components/user/display');


React.render(
    <ArticleBox userConnected='true' />,
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

React.render(
    <UserDisplay/>,
    document.getElementById('user-pref')
);
