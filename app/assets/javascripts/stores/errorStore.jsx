'use strict';

var ErrorActions = require('../actions/errorActions');

var ErrorStore = Reflux.createStore({
    listenables: [ErrorActions],
    url: '/errors',

    init: function () {
    },

    onLoadErrors: function (data) {
        var requestParam = {};

        if (data) {
            if (data.page) {
                requestParam.page = data.page;
            } else {
                requestParam.page = 1;
            }
        }

        jQuery.getJSON(
            this.url,
            requestParam,
            function (data) {
                this.trigger(data);
            }.bind(this))
            .fail(function (xhr, status, error) {
                return false;
            }.bind(this));
    },

    onPushError: function (error) {
        var requestParam = {};
        requestParam.error = {};

        if (error) {
            requestParam.error.message = error.message;
            requestParam.error.class_name = error.url;
            requestParam.error.trace = error.trace;
            requestParam.error.origin = error.origin;
            requestParam.error.target_url = window.location.href;
            if(error.lineNumber) {
                requestParam.error.line_number = error.lineNumber;
            }
            if(error.columnNumber) {
                requestParam.error.column_number = error.columnNumber;
            }
        } else {
            return;
        }

        $.ajax({
            url: this.url,
            dataType: 'json',
            type: 'POST',
            data: requestParam,
            success: function (data) {
                return true;
            }.bind(this),
            error: function (xhr, status, error) {
                return false;
            }.bind(this)
        });
    }
});

module.exports = ErrorStore;
