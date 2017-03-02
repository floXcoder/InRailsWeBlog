'use strict';

import ErrorStore from '../stores/errorStore';

const ErrorsMixin = (superclass) => class extends superclass {
    handleErrors (url, xhr, status, error) {
        if (status === 'error') {
            if (error === 'Forbidden') {
                if (this.displayUnauthorizedMessage !== undefined) {
                    this.displayUnauthorizedMessage();
                } else {
                    Notification.error(I18n.t('js.helpers.errors.not_authorized'), 10);
                }
            } else if (error === 'Unprocessable Entity') {
                var errorMessage = JSON.parse(xhr.responseText);
                // Function called for each shop
                if (this.displayErrorsMessage !== undefined) {
                    this.displayErrorsMessage(url, errorMessage);
                }
            } else if (error === 'Internal Server Error') {
                Notification.error(I18n.t('js.helpers.errors.server'), 10);
            }
        } else {
            log.error('Unknown Error in JSON request: ' + error + ', status:' + status);
        }

        ErrorStore.pushError({
            message: error,
            url: url,
            trace: xhr.responseText,
            origin: 'communication'
        });
    }
};

export default ErrorsMixin;
