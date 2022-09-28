'use strict';

import {
    stringify
} from 'qs';

import {
    pushError
} from '../actions';

import AnalyticsService from '../modules/analyticsService';


let retryTokenCount = 0;

const _getHeaders = (external = false) => {
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

const _getDataHeaders = () => {
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


const _processSerializeParams = (value, formData, parent) => {
    const processedKey = parent || '';
    const excludeNull = true;
    const useBrackets = true;
    const arrayIndexes = true;
    const useDotSeparator = false;

    if (value === null || value === undefined) {
        if (!excludeNull) {
            formData.append(processedKey, '');
        }
        return;
    }

    if (value instanceof File) {
        formData.append(processedKey, value);
        return;
    }

    if (value instanceof Blob) {
        formData.append(processedKey, value);
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            let computedKey = processedKey;
            if (useBrackets) {
                computedKey += `[${arrayIndexes ? index : ''}]`;
            }
            _processSerializeParams(item, formData, computedKey);
        });
        return;
    }

    if (Utils.is().isObject(value)) {
        Object.entries(value)
            .forEach(([key, data]) => {
                let computedKey = key;
                if (parent) {
                    computedKey = useDotSeparator
                        ? `${parent}.${key}`
                        : `${parent}[${key}]`;
                }
                _processSerializeParams(data, formData, computedKey);
            });
        return;
    }

    if (typeof value === 'boolean') {
        formData.append(processedKey, value ? 'true' : 'false');
        return;
    }

    formData.append(processedKey, value);
};

const _serializeParams = (params) => {
    const formData = new FormData();

    _processSerializeParams(params, formData);

    return formData;
};

const _manageError = (origin, error, url) => {
    if (url === '/errors') {
        return;
    }

    // Error message display by _handleFlashMessage function
    if (error.headers?.get('X-Flash-Messages')) {
        return;
    }

    const errorInfo = {
        origin,
        url
    };

    if (error.statusText) {
        if (error.statusText === 'Forbidden') {
            // Notification.error(I18n.t('js.helpers.errors.not_authorized'));
            // if (document.referrer === '') {
            //     window.location = '/';
            // } else {
            //     history.back();
            // }

            return error;
        } else if (error.statusText === 'Cancelled') {
            return error;
        } else if (error.statusText === 'Not Found') {
            // Notification.error(I18n.t('js.helpers.errors.unprocessable'));
            // } else if (error.statusText === 'Unprocessable Entity') {
            // Managed by _handleResponse
            // if (!error.bodyUsed) {
            //     return error.json().then((status) => (
            //         Notification.error(status.error || status.errors || error.statusText)
            //     ));
            // } else {
            //     Notification.error(I18n.t('js.helpers.errors.unprocessable'));
            // }

            return error;
        } else if (error.statusText === 'Internal Server Error') {
            if (!error.bodyUsed) {
                const contentType = error.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    return error.json()
                        .then((parsedError) => {
                            if (GlobalEnvironment.NODE_ENV !== 'production') {
                                window.log_on_screen([parsedError.errors, parsedError.details].join(' / ')
                                    .split('\n')
                                    .slice(0, 10));
                            } else {
                                Notification.error(I18n.t('js.helpers.errors.server'));
                            }

                            pushError(error, {...errorInfo, ...parsedError});
                        });
                } else {
                    return error.text()
                        .then((text) => {
                            if (GlobalEnvironment.NODE_ENV !== 'production') {
                                window.log_on_screen(
                                    text.split('\n')
                                        .slice(0, 10)
                                );
                            } else {
                                Notification.error(I18n.t('js.helpers.errors.server'));
                            }

                            pushError(error, {...errorInfo});
                        });
                }
            } else {
                if (GlobalEnvironment.NODE_ENV !== 'production') {
                    window.log_on_screen(
                        error.split('\n')
                            .slice(0, 10)
                    );
                } else {
                    Notification.error(I18n.t('js.helpers.errors.server'));
                }

                pushError(error, errorInfo);
            }
        }
    } else {
        pushError(error, errorInfo);
    }
};

const _handleTokenError = (response, url, params, isData) => {
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

const _handleResponseErrors = (response, url) => {
    if (response.status && !response.ok) {
        _manageError('server', response, url);
    }

    return response;
};

const _handleParseErrors = (error, url, isGet = false) => {
    if (error.message === 'TokenError' || error.name === 'AbortError' || error.name === 'SecurityError' || error.name === 'ChunkLoadError') {
        return {
            abort: true
        };
    }

    // Offline mode (do not report error)
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        if (isGet) {
            Notification.error(I18n.t('js.helpers.errors.no_network'));
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

    _manageError('communication', error, url);

    return {
        errors: error.message
    };
};

const _handleFlashMessage = (response) => {
    if (response && response.headers) {
        let flashMessage = response.headers.get('X-Flash-Messages');

        if (flashMessage) {
            flashMessage = JSON.parse(decodeURIComponent(escape(flashMessage)));

            // Avoid "click away" to close notification just after appearing
            setTimeout(() => {
                if (flashMessage?.success) {
                    Notification.success(flashMessage.success.replace(/&amp;/g, '&')
                        .replace(/&gt;/g, '<')
                        .replace(/&lt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, '\''));
                }

                if (flashMessage && (flashMessage.notice || flashMessage.alert)) {
                    Notification.alert((flashMessage.notice || flashMessage.alert).replace(/&amp;/g, '&')
                        .replace(/&gt;/g, '<')
                        .replace(/&lt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, '\''));
                }

                if (flashMessage?.error) {
                    Notification.error(flashMessage.error.replace(/&amp;/g, '&')
                        .replace(/&gt;/g, '<')
                        .replace(/&lt;/g, '>')
                        .replace(/&quot;/g, '"')
                        .replace(/&#39;/g, '\''));
                }
            }, 100);
        }
    }

    return response;
};

const _handleResponse = (response) => {
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

const _handleTrackingData = (response) => {
    if (response?.meta?.trackingData) {
        AnalyticsService.trackAction(response.meta.trackingData, 'fetch');
    }

    return response;
};

const api = {
    get: (url, params, external = false) => {
        const headers = _getHeaders(external);
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
            .then((response) => _handleResponseErrors(response, urlParams))
            .then((response) => _handleFlashMessage(response))
            .then((response) => _handleResponse(response))
            .then((response) => _handleTrackingData(response))
            .catch((error) => _handleParseErrors(error, urlParams, true));

        return {
            promise,
            signal: controller
        };
    },

    post: (url, params, isData = false) => {
        const headers = isData ? _getDataHeaders() : _getHeaders();
        const parameters = isData ? params : JSON.stringify(params);

        return fetch(url + '.json', {
            ...headers,
            method: 'POST',
            body: parameters
        })
            .then((response) => _handleTokenError(response, url, params, isData))
            .then((response) => _handleResponseErrors(response, url))
            .then((response) => _handleFlashMessage(response))
            .then((response) => _handleResponse(response))
            .catch((error) => _handleParseErrors(error, url));
    },

    update: (url, params, isData = false) => {
        const headers = isData ? _getDataHeaders() : _getHeaders();
        const parameters = isData ? params : JSON.stringify(params);

        return fetch(url + '.json', {
            ...headers,
            method: 'PUT',
            body: parameters
        })
            .then((response) => _handleTokenError(response, url, isData))
            .then((response) => _handleResponseErrors(response, url))
            .then((response) => _handleFlashMessage(response))
            .then((response) => _handleResponse(response))
            .catch((error) => _handleParseErrors(error, url));
    },

    delete: (url, params) => {
        const headers = _getHeaders();
        const parameters = JSON.stringify(params);

        return fetch(url + '.json', {
            ...headers,
            method: 'DELETE',
            body: parameters
        })
            .then((response) => _handleResponseErrors(response, url))
            .then((response) => _handleFlashMessage(response))
            .then((response) => _handleResponse(response))
            .catch((error) => _handleParseErrors(error, url));
    },

    sendBeacon: (url, params) => {
        if (typeof window.navigator.sendBeacon !== 'function') {
            return;
        }

        window.navigator.sendBeacon(url, _serializeParams(params));
    }
};

export default api;
