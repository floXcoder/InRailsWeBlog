'use strict';

// TODO
// import ErrorStore from '../stores/errorStore';

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
                const errorMessage = JSON.parse(xhr.responseText);
                if (this.displayErrorsMessage !== undefined) {
                    this.displayErrorsMessage(url, errorMessage);
                }
            } else if (error === 'Internal Server Error') {
                if (window.railsEnv === 'development') {
                    log.now(xhr.responseText.split("\n").slice(0, 6))
                } else {
                    Notification.error(I18n.t('js.helpers.errors.server'), 10);
                }
            }
        } else {
            log.error('Unknown Error in JSON request: ' + error + ', status:' + status);
        }

        // TODO
        // ErrorStore.pushError({
        //     message: error,
        //     url: url,
        //     trace: xhr.responseText,
        //     origin: 'communication'
        // });
    }
};

export default ErrorsMixin;
