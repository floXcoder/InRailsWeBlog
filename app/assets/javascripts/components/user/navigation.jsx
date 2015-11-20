"use strict";

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
