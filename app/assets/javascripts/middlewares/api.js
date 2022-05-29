'use strict';

import {
    stringify
} from 'qs';

import {
    trackAction,
    pushError
} from '../actions';

let retryTokenCount = 0;

const getHeaders = (external = false) => {
    if (external) {
        return {
            headers: new Headers({
                Accept: 'application/json',
                // 'Content-Type': 'application/json'
            })
        };
    } else {
        const csrfToken = document.getElementsByName('csrf-token')[0];
        const token = csrfToken?.getAttribute('content');

        return {
            credentials: 'same-origin',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': token
            })
        };
    }
};

const getDataHeaders = () => {
    const csrfToken = document.getElementsByName('csrf-token')[0];
    const token = csrfToken?.getAttribute('content');

    return {
        credentials: 'same-origin',
        headers: new Headers({
            'X-CSRF-Token': token,
            Accept: 'application/json'
        })
    };
};

const manageError = (origin, error, url) => {
    if (url === '/errors') {
        return;
    }

    // Error message display by handleFlashMessage function
    if (error.headers?.get('X-Flash-Messages')) {
        return;
    }

    const errorInfo = {
        origin,
        url
    };

    if (error.statusText) {
        if (error.statusText === 'Forbidden') {
            // Notification.message.error(I18n.t('js.helpers.errors.not_authorized'));
            // if (document.referrer === '') {
            //     window.location = '/';
            // } else {
            //     history.back();
            // }

            return error;
        } else if (error.statusText === 'Cancelled') {
            return error;
        } else if (error.statusText === 'Not Found') {
            // Notification.message.error(I18n.t('js.helpers.errors.unprocessable'));
            // } else if (error.statusText === 'Unprocessable Entity') {
            // Managed by handleResponse
            // if (!error.bodyUsed) {
            //     return error.json().then((status) => (
            //         Notification.message.error(status.error || status.errors || error.statusText)
            //     ));
            // } else {
            //     Notification.message.error(I18n.t('js.helpers.errors.unprocessable'));
            // }

            return error;
        } else if (error.statusText === 'Internal Server Error') {
            if (!error.bodyUsed) {
                error.json()
                    .then((parsedError) => {
                        Notification.message.error(parsedError.errors);

                        if (GlobalEnvironment.NODE_ENV !== 'production') {
                            window.log_on_screen([parsedError.errors, parsedError.details].join(' / ')
                                .split('\n')
                                .slice(0, 6));
                        }

                        pushError(error, {...errorInfo, ...parsedError});
                    });
            } else {
                if (GlobalEnvironment.NODE_ENV === 'production') {
                    Notification.message.error(I18n.t('js.helpers.errors.server'));
                }

                pushError(error, errorInfo);
            }
        }
    } else {
        pushError(error, errorInfo);
    }
};

const handleTokenError = (response, url, params, isData) => {
    if (response.status === 405) {
        return response.json()
            .then((status) => {
                const csrfToken = document.getElementsByName('csrf-token')[0];
                csrfToken?.setAttribute('content', status.token);

                if (retryTokenCount > 0) {
                    // Cannot get good token: reload the page
                    window.location.reload();
                    return Promise.reject(new Error('TokenError'));
                } else {
                    retryTokenCount++;
                    return api.post(url, params, isData);
                }
            });
    } else {
        retryTokenCount = 0;

        return response;
    }
};

const handleResponseErrors = (response, url) => {
    if (response.status && !response.ok) {
        manageError('server', response, url);
    }

    return response;
};

const handleParseErrors = (error, url, isGet = false) => {
    if (error.message === 'TokenError' || error.name === 'AbortError' || error.name === 'SecurityError' || error.name === 'ChunkLoadError') {
        return {
            abort: true
        };
    }

    // Offline mode (do not report error)
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        if (isGet) {
            Notification.message.error(I18n.t('js.helpers.errors.no_network'));
        }

        return {
            errors: 'offline'
        };
    }

    // Ignore get fetch errors (likewise just open a new page)
    if (isGet && error.name === 'TypeError' && error.message === 'NetworkError when attempting to fetch resource.') {
        return;
    }

    if (error.message === 'NetworkError when attempting to fetch resource.') {
        error.message = I18n.t('js.helpers.errors.network');
    }

    manageError('communication', error, url);

    return {
        errors: error.message
    };
};

const handleFlashMessage = (response) => {
    if (response && response.headers) {
        let flashMessage = response.headers.get('X-Flash-Messages');

        if (flashMessage) {
            flashMessage = JSON.parse(decodeURIComponent(escape(flashMessage)));

            if (flashMessage?.success) {
                Notification.message.success(flashMessage.success.replace(/&amp;/g, '&')
                    .replace(/&gt;/g, '<')
                    .replace(/&lt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, '\''));
            }

            if (flashMessage && (flashMessage.notice || flashMessage.alert)) {
                Notification.message.alert((flashMessage.notice || flashMessage.alert).replace(/&amp;/g, '&')
                    .replace(/&gt;/g, '<')
                    .replace(/&lt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, '\''));
            }

            if (flashMessage?.error) {
                Notification.message.error(flashMessage.error.replace(/&amp;/g, '&')
                    .replace(/&gt;/g, '<')
                    .replace(/&lt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, '\''));
            }
        }
    }

    return response;
};

const handleResponse = (response) => {
    if (!response.status) {
        return response;
    }

    if (response.bodyUsed) {
        return {
            errors: response.statusText
        };
    } else if (response.status === 422) { // Response must have a primary "errors" key to be processed
        return response.json();
    } else if (!response.ok) {
        return response.json()
            .then((status) => ({
                errors: status.error || status.errors || response.statusText
            }));
    } else if (response.status !== 204) { // No content response
        return response.json();
    }

    return response;
};

const handleTrackingData = (response) => {
    if (response?.meta?.trackingData) {
        trackAction(response.meta.trackingData, 'fetch');
    }

    return response;
};

const api = {
    get: (url, params, external = false) => {
        const headers = getHeaders(external);
        const parameters = stringify(params, {arrayFormat: 'brackets'});
        let urlParams;
        if (external) {
            urlParams = url;
        } else {
            urlParams = `${url}.json${parameters !== '' ? '?' + parameters : ''}`;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const promise = fetch(urlParams, {
            ...headers,
            method: 'GET',
            signal
        })
            .then((response) => handleResponseErrors(response, urlParams))
            .then((response) => handleFlashMessage(response))
            .then((response) => handleResponse(response))
            .then((response) => handleTrackingData(response))
            .catch((error) => handleParseErrors(error, urlParams, true));

        return {
            promise,
            signal: controller
        };
    },

    post: (url, params, isData = false) => {
        const headers = isData ? getDataHeaders() : getHeaders();
        const parameters = isData ? params : JSON.stringify(params);

        return fetch(url + '.json', {
            ...headers,
            method: 'POST',
            body: parameters
        })
            .then((response) => handleTokenError(response, url, params, isData))
            .then((response) => handleResponseErrors(response, url))
            .then((response) => handleFlashMessage(response))
            .then((response) => handleResponse(response))
            .catch((error) => handleParseErrors(error, url));
    },

    update: (url, params, isData = false) => {
        const headers = isData ? getDataHeaders() : getHeaders();
        const parameters = isData ? params : JSON.stringify(params);

        return fetch(url + '.json', {
            ...headers,
            method: 'PUT',
            body: parameters
        })
            .then((response) => handleTokenError(response, url, isData))
            .then((response) => handleResponseErrors(response, url))
            .then((response) => handleFlashMessage(response))
            .then((response) => handleResponse(response))
            .catch((error) => handleParseErrors(error, url));
    },

    delete: (url, params) => {
        const headers = getHeaders();
        const parameters = JSON.stringify(params);

        return fetch(url + '.json', {
            ...headers,
            method: 'DELETE',
            body: parameters
        })
            .then((response) => handleResponseErrors(response, url))
            .then((response) => handleFlashMessage(response))
            .then((response) => handleResponse(response))
            .catch((error) => handleParseErrors(error, url));
    }
};

export default api;
