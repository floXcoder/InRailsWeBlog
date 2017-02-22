'use strict';

var ErrorActions = require('../actions/errorActions');

var ErrorsMixin = {
    handleErrors: function (url, xhr, status, error) {
        if (status === 'error') {
            if (error === 'Forbidden') {
                if (this.displayUnauthorizedMessage !== undefined) {
                    this.displayUnauthorizedMessage();
                } else {
                    Materialize.toast(I18n.t('js.errors.not_authorized'), 10000);
                }
            } else if (error === 'Unprocessable Entity') {
                var errorMessage = JSON.parse(xhr.responseText);
                // Function called for each shop
                if (this.displayErrorsMessage !== undefined) {
                    this.displayErrorsMessage(url, errorMessage);
                }
            } else if (error === 'Internal Server Error') {
                Materialize.toast(I18n.t('js.errors.server'), 10000);
            }
        } else {
            log.error('Unknown Error in JSON request: ' + error + ', status:' + status);
        }

        ErrorActions.pushError({
            message: error,
            url: url,
            trace: xhr.responseText,
            origin: 'communication'
        });
    }
};

module.exports = ErrorsMixin;
