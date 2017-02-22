'use strict';

var UserActions = Reflux.createActions([
    'loadUsers',
    'validation',
    'loadUserComments',
    'loadUserActivities',
    'loadUser',
    'updateUser',
    'updateUserPreference',
    'addTopic',
    'changeTopic',
    'updateTopic',
    'deleteTopic',
    'trackClick',
    'trackView'
]);

module.exports = UserActions;
