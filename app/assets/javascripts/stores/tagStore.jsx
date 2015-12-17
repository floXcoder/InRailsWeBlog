'use strict';

var Errors = require('../mixins/errors');
var Tracker = require('../mixins/tracker');

var TagActions = require('../actions/tagActions');

var TagStore = Reflux.createStore({
    mixins: [Errors, Tracker],
    listenables: [TagActions],
    tagList: {},
    url: '/tags',

    init () {
        this.onFetchTags();
    },

    onFetchTags () {
        var requestParam = {};

        jQuery.getJSON(
            this.url,
            requestParam,
            function (dataReceived) {
                if (!$.isEmpty(dataReceived)) {
                    this.tagList = dataReceived.tags;
                    this.trigger(this.tagList);
                } else {
                    log.error('No data received from fetch tags');
                }
            }.bind(this))
            .fail(function (xhr, status, error) {
                this.handleErrors(this.url, xhr, status, error);
            }.bind(this));
    }
});

module.exports = TagStore;
