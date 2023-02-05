'use strict';


export const pushError = (error, errorInfo = null) => {
    if (!error) {
        return;
    }

    if (error.name && (error.name === 'AbortError' || error.name === 'ChunkLoadError')) {
        return;
    }

    if (window.SentryCaptureException && window.SentryCaptureMessage) {
        window.SentryWithScope((scope) => {
            if (error instanceof Error) {
                scope.setExtras(errorInfo);
                window.SentryCaptureException(error);
            } else {
                errorInfo = {url: error.url, ...(errorInfo || {})};
                scope.setExtras(errorInfo);
                const errorMessage = [error.statusText, error.status].filter((err) => !!err);
                window.SentryCaptureMessage(errorMessage.join(', '));
            }
        });
    } else if (GlobalEnvironment.NODE_ENV !== 'test') {
        console.error(error, errorInfo);
    }
};

export const manageImportError = (error) => {
    pushError(error);

    Notification.error(I18n.t('js.helpers.errors.boundary.title'));

    return {
        default: () => null
    };
};
