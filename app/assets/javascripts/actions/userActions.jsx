'use strict';

require('../stores/userStore');

var UserActions = Reflux.createActions([
    'changeDisplay',
    'changeForm',
    'changeSearchOptions',
    'validation'
]);

module.exports = UserActions;
