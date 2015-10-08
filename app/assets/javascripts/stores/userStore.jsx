var UserAction = require('../actions/userAction');

var UserStore = Reflux.createStore({
    listenables: [UserAction],
    userPreferences: {},
    url: '/users',

    init: function () {
    },

    onChangeDisplay: function (displayType) {
        this.userPreferences.displayType = displayType;
        this.trigger(this.userPreferences);
    }
});

module.exports = UserStore;
