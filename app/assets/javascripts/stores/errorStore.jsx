'use strict';

var ErrorActions = require('../actions/errorActions');

var ErrorStore = Reflux.createStore({
    listenables: [ErrorActions],
    url: '/errors',

    init () {
    },

    onLoadErrors (data) {
        let requestParam = {};
        if (data) {
            if (data.page) {
                requestParam.page = data.page;
            } else {
                requestParam.page = 1;
            }
        }

        $.getJSON(
            this.url,
            requestParam)
            .done((dataReceived) => {
                this.trigger({
                    type: 'loadErrors',
                    errors: dataReceived
                });
            })
            .fail((xhr, status, error) => {
                return false;
            });
    },

    onPushError (error) {
        let requestParam = {};
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
            data: requestParam
        })
            .done(() => {
                return true;
            })
            .fail(() => {
                return false;
            });
    },

    onDeleteError (errorId) {
        if ($.isEmpty(errorId)) {
            log.error('Tried to remove an error without error id');
            return;
        }

        let url = this.url + '/' + errorId;

        let requestParam = {};
        requestParam._method = 'delete';

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                if (!$.isEmpty(dataReceived)) {
                    this.trigger({
                        type: 'deleteError',
                        deletedError: dataReceived
                    });
                } else {
                    log.error('No data received from delete error');
                }
            })
            .fail((xhr) => {
                if (xhr && xhr.status === 403) {
                    this.trigger({errorErrors: xhr.responseJSON});
                } else {
                    return false;
                }
            });
    },

    onDeleteAllErrors () {
        let url = this.url + '/delete_all';

        let requestParam = {};

        $.ajax({
            url: url,
            dataType: 'json',
            type: 'POST',
            data: requestParam
        })
            .done((dataReceived) => {
                this.trigger({
                    type: 'deleteAllErrors',
                    errorsDeleted: dataReceived
                });
            })
            .fail(() => {
                return false;
            });
    }
});

module.exports = ErrorStore;
