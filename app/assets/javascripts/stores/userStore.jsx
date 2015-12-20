'use strict';

var Errors = require('../mixins/errors');
var Tracker = require('../mixins/tracker');

var UserActions = require('../actions/userActions');
var ErrorActions = require('../actions/errorActions');

var UserStore = Reflux.createStore({
    mixins: [Errors, Tracker],
    listenables: [UserActions],
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

    init () {
        this._loadUserPreferences();
        return true;
    },

    _loadUserPreferences (data) {
        if($.isEmpty(this.user.id)) {
            return;
        }

        var requestParam = {};

        var preferenceUrl = this.url + '/' + this.user.id + '/preferences';

        jQuery.getJSON(
            preferenceUrl,
            requestParam,
            function (dataReceived) {
                if (!$.isEmpty(dataReceived)) {
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
                } else {
                    log.error('No data received from load user preferences');
                }
            }.bind(this));
    },

    _pushUserPreferences (data) {
        if($.isEmpty(this.user.id)) {
            return;
        }

        var requestParam = {};
        requestParam.preferences = {};

        var preferenceUrl = this.url + '/' + this.user.id + '/preferences';

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
            success: (_dataReceived) => {
                return true;
            },
            error: (xhr, status, error) => {
                this.handleErrors(preferenceUrl, xhr, status, error);
            }
        });
    },

    onChangeDisplay (displayType) {
        if ($.isEmpty(displayType)) {
            log.error('Tried to change display without display type');
            return;
        }

        var displayPreferences = {};

        // Manage in articles/box
        displayPreferences.article_display = displayType;
        this.user.preferences.article_display = displayPreferences.article_display;

        this.trigger({preferences: displayPreferences});
        this._pushUserPreferences(displayPreferences);
    },

    onChangeForm (formOptions) {
        if ($.isEmpty(formOptions)) {
            log.error('Tried to change form options without options');
            return;
        }

        var formPreferences = {};

        // Manage in articles/form
        formPreferences.multi_language = formOptions.multi_language;
        this.user.preferences.multi_language = formPreferences.multi_language;

        this.trigger({preferences: formPreferences});
        this._pushUserPreferences(formPreferences);
    },

    onChangeSearchOptions (searchOptions) {
        if ($.isEmpty(formOptions)) {
            log.error('Tried to change search options without options');
            return;
        }

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
    },

    onValidation (data) {
        if ($.isEmpty(data)) {
            log.error('Tried to validate user without data');
            return;
        }

        var validationUrl = this.url + '/validation';
        var requestParam = data;

        jQuery.getJSON(
            validationUrl,
            requestParam,
            function (dataReceived) {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger(dataReceived);
                } else {
                    log.error('No data received from user validation');
                }
            }.bind(this))
            .fail(function (xhr, status, error) {
                this.handleErrors(validationUrl, xhr, status, error);
            }.bind(this));
    }
});

module.exports = UserStore;
