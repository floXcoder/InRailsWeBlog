var UserAction = require('../actions/userAction');

var UserStore = Reflux.createStore({
    listenables: [UserAction],
    user: {
        id: window.currentUserId,
        preferences: {},
        search: {}
    },
    url: '/users',

    init: function () {
        this._loadUserPreferences();
    },

    _loadUserPreferences: function (data) {
        if($utils.isEmpty(this.user.id)) {
            return;
        }

        var requestParam = {};

        var preferenceUrl = this.url + '/' + this.user.id + '/preference';

        //if (data) {
        //    if (data.user) {
        //        url += '/' + this.userId + '/preference';
        //    }
        //}

        jQuery.getJSON(
            preferenceUrl,
            requestParam,
            function (data) {
                this.user.preferences = data.preferences;
                this.trigger(this.user);
            }.bind(this));
    },

    _pushUserPreferences: function (data) {
        if($utils.isEmpty(this.user.id)) {
            return;
        }

        var requestParam = {};
        requestParam.preferences = {};

        var preferenceUrl = this.url + '/' + this.user.id + '/preference';

        if (data.article_display) {
            requestParam.preferences.article_display = data.article_display;
        }

        if(data.search_highlight) {
            requestParam.preferences.search_highlight = data.search_highlight;
        }

        if(data.search_operator) {
            requestParam.preferences.search_operator = data.search_operator;
        }

        if(data.search_exact) {
            requestParam.preferences.search_exact = data.search_exact;
        }

        $.ajax({
            url: preferenceUrl ,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: function (data) {

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.url, status, err.toString());
            }.bind(this)
        });
    },

    onChangeDisplay: function (displayType) {
        var displayPreferences = {};

        // Manage in articles/box
        displayPreferences.article_display = displayType;
        this.user.preferences.article_display = displayPreferences.article_display;

        this.trigger({preferences: displayPreferences});
        this._pushUserPreferences(displayPreferences);
    },

    onChangeSearchOptions: function (searchOptions) {
        var searchPreferences = {};

        // Manage in search/module
        if(typeof(searchOptions.search_highlight) !== 'undefined') {
            searchPreferences.search_highlight = searchOptions.search_highlight;
            this.user.preferences.search_highlight = searchPreferences;
        }

        // Manage in search/module
        if(typeof(searchOptions.search_operator) !== 'undefined') {
            searchPreferences.search_operator = searchOptions.search_operator;
            this.user.preferences.search_operator = searchPreferences;
        }

        // Manage in articles/box
        if(typeof(searchOptions.search_exact) !== 'undefined') {
            searchPreferences.search_exact = searchOptions.search_exact;
            this.user.preferences.search_exact = searchPreferences;
        }

        this.trigger({search: searchPreferences});
        this._pushUserPreferences(searchPreferences);
    }

});

module.exports = UserStore;
