require('../common');
var ArticleBox = require('../../components/articles/box');
var AssociatedTagBox = require('../../components/tags/associatedBox');
var IndexTagBox = require('../../components/tags/indexBox');
var UserPreference = require('../../components/user/preference');
var SearchModule = require('../../components/search/module');

// Navigation bar
ReactDOM.render(
    <UserPreference/>,
    document.getElementById('user-pref')
);
ReactDOM.render(
    <SearchModule/>,
    document.getElementById('search-nav-component')
);

// Main
ReactDOM.render(
    <ArticleBox userConnected='true' />,
    document.getElementById('react-main')
);

// Sidebar
//ReactDOM.render(
//    <AssociatedTagBox/>,
//    document.getElementById('sidebar-associated-tags')
//);
//ReactDOM.render(
//    <IndexTagBox/>,
//    document.getElementById('sidebar-index-tags')
//);
