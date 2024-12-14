import I18n from '@js/modules/translations';

import Notification from '@js/modules/notification';


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
    } else if (import.meta.env?.DEV) {
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
