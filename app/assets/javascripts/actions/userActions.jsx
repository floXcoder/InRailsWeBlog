'use strict';

require('../stores/userStore');

var UserActions = Reflux.createActions([
    'changeDisplay',
    'changeForm',
    'changeSearchOptions',
    'validation',
    'trackClick',
    'trackView'
]);

module.exports = UserActions;
