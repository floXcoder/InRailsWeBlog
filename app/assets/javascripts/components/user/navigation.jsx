// Navigation bar
var UserPreference = require('../../components/user/preference');
var SearchModule = require('../../components/search/module');
ReactDOM.render(
    <UserPreference/>,
    document.getElementById('user-pref')
);
ReactDOM.render(
    <SearchModule/>,
    document.getElementById('search-nav-component')
);


// Sidebar
//var AssociatedTagBox = require('../../components/tags/associatedBox');
//var IndexTagBox = require('../../components/tags/indexBox');
//ReactDOM.render(
//    <AssociatedTagBox/>,
//    document.getElementById('sidebar-associated-tags')
//);
//ReactDOM.render(
//    <IndexTagBox/>,
//    document.getElementById('sidebar-index-tags')
//);
