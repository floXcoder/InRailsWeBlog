"use strict";

var UserAction = require('../actions/userAction');

var UserStore = Reflux.createStore({
    listenables: [UserAction],
    user: {
        id: window.currentUserId,
        preferences: {
            article_display: window.parameters.article_display,
            multi_language: window.parameters.multi_language,
            search_highlight: window.parameters.search_highlight,
            search_operator: window.parameters.search_operator,
            search_exact: window.parameters.search_exact
        },
        search: {}
    },
    url: '/users',

    init: function () {
        this._loadUserPreferences();
    },

    _loadUserPreferences: function (data) {
        if($.isEmpty(this.user.id)) {
            return;
        }

        var requestParam = {};

        var preferenceUrl = this.url + '/' + this.user.id + '/preference';

        jQuery.getJSON(
            preferenceUrl,
            requestParam,
            function (dataReceived) {

                var newPreferences = {};

                if (dataReceived.user.article_display
                    && dataReceived.user.article_display !== this.user.preferences.article_display) {
                    newPreferences.article_display = dataReceived.user.article_display;
                }
                if (dataReceived.user.multi_language
                    && dataReceived.user.multi_language !== this.user.preferences.multi_language) {
                    newPreferences.multi_language = dataReceived.user.multi_language;
                }
                if (dataReceived.user.search_highlight
                    && dataReceived.user.search_highlight !== this.user.preferences.search_highlight) {
                    newPreferences.search_highlight = dataReceived.user.search_highlight;
                }
                if (dataReceived.user.search_operator
                    && dataReceived.user.search_operator !== this.user.preferences.search_operator) {
                    newPreferences.search_operator = dataReceived.user.search_operator;
                }
                if (dataReceived.user.search_exact
                    && dataReceived.user.search_exact !== this.user.preferences.search_exact) {
                    newPreferences.search_exact = dataReceived.user.search_exact;
                }

                // Manage in user/preference, articles/box and articles/form
                this.user.preferences = dataReceived.user;
                this.trigger({preferences: newPreferences});
            }.bind(this));
    },

    _pushUserPreferences: function (data) {
        if($.isEmpty(this.user.id)) {
            return;
        }

        var requestParam = {};
        requestParam.preferences = {};

        var preferenceUrl = this.url + '/' + this.user.id + '/preference';

        requestParam.preferences.article_display = data.article_display;
        requestParam.preferences.multi_language = data.multi_language;
        requestParam.preferences.search_highlight = data.search_highlight;
        requestParam.preferences.search_operator = data.search_operator;
        requestParam.preferences.search_exact = data.search_exact;

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

    onChangeForm: function (formOptions) {
        var formPreferences = {};

        // Manage in articles/form
        formPreferences.multi_language = formOptions.multi_language;
        this.user.preferences.multi_language = formPreferences.multi_language;

        this.trigger({preferences: formPreferences});
        this._pushUserPreferences(formPreferences);
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
