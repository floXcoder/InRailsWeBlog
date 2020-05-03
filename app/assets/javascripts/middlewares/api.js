'use strict';

import {
    stringify
} from 'qs';

import {
    pushError
} from '../actions';

const getHeaders = () => {
    const csrfToken = document.getElementsByName('csrf-token')[0];
    const token = csrfToken?.getAttribute('content');

    return {
        credentials: 'same-origin',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        })
    };
};

const getDataHeaders = () => {
    const csrfToken = document.getElementsByName('csrf-token')[0];
    const token = csrfToken?.getAttribute('content');

    return {
        credentials: 'same-origin',
        headers: new Headers({
            'X-CSRF-Token': token,
            'Accept': 'application/json'
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

    let errorInfo = {
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
        } else if (error.statusText === 'Not found') {
            // Notification.error(I18n.t('js.helpers.errors.unprocessable'));
        // } else if (error.statusText === 'Unprocessable Entity') {
            // Managed by handleResponse
            // if (!error.bodyUsed) {
            //     return error.json().then((status) => (
            //         Notification.error(status.error || status.errors || error.statusText)
            //     ));
            // } else {
            //     Notification.error(I18n.t('js.helpers.errors.unprocessable'));
            // }
        } else {
            if (error.statusText === 'Internal Server Error') {
                if (process.env.NODE_ENV === 'production') {
                    Notification.error(I18n.t('js.helpers.errors.server'), 10);
                } else {
                    error.text().then((text) => log.now(text.split("\n").slice(0, 6)));
                }
            }

            pushError(error, errorInfo);
        }
    } else {
        pushError(error, errorInfo);
    }
};

const handleResponseErrors = (response, url) => {
    if (!response.ok) {
        manageError('server', response, url);
    }

    return response;
};

const handleParseErrors = (error, url, isGet = false) => {
    // Offline mode (do not report error)
    if(error.name === 'TypeError' && error.message === 'Failed to fetch') {
        if(isGet) {
            Notification.error(I18n.t('js.helpers.errors.no_network'));
        }

        return {
            errors: 'offline'
        };
    }

    if (error.name === 'AbortError') {
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
    let flashMessage = response.headers.get('X-Flash-Messages');

    // Article errors are managed in article component
    if (flashMessage && !response.url?.match(/\/articles$/)) {
        flashMessage = JSON.parse(decodeURIComponent(escape(flashMessage)));

        if (flashMessage?.success) {
            Notification.success(flashMessage.success.replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }

        if (flashMessage && (flashMessage.notice || flashMessage.alert)) {
            Notification.alert((flashMessage.notice || flashMessage.alert).replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }

        if (flashMessage?.error) {
            Notification.error(flashMessage.error.replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }
    }

    return response;
};

const handleResponse = (response) => {
    if (response.bodyUsed) {
        return {
            errors: response.statusText
        };
    } else if (response.status === 422) { // Response must have a primary "errors" key to be processed
        return response.json();
    } else if (!response.ok) {
        return response.json().then((status) => ({
            errors: status.error || status.errors || response.statusText
        }));
    } else if (response.status !== 204) { // No content response
        return response.json();
    }
};

const api = {
    get: (url, params) => {
        const headers = getHeaders();
        const parameters = stringify(params, {arrayFormat: 'brackets'});
        const urlParams = `${url}.json${parameters !== '' ? '?' + parameters : ''}`;

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
            .then(
                (json) => json,
                (error) => handleParseErrors(error, urlParams, true)
            );

        return {
            promise,
            controller
        };
    },

    post: (url, params, isData = false) => {
        const headers = isData ? getDataHeaders() : getHeaders();
        const parameters = isData ? params : JSON.stringify(params);

        return fetch(url, {
            ...headers,
            method: 'POST',
            body: parameters
        })
            .then((response) => handleResponseErrors(response, url))
            .then((response) => handleFlashMessage(response))
            .then((response) => handleResponse(response))
            .then(
                (json) => json,
                (error) => handleParseErrors(error, url)
            )
    },

    update: (url, params, isData = false) => {
        const headers = isData ? getDataHeaders() : getHeaders();
        const parameters = isData ? params : JSON.stringify(params);

        return fetch(url, {
            ...headers,
            method: 'PUT',
            body: parameters
        })
            .then((response) => handleResponseErrors(response, url))
            .then((response) => handleFlashMessage(response))
            .then((response) => handleResponse(response))
            .then(
                (json) => json,
                (error) => handleParseErrors(error, url)
            )
    },

    delete: (url, params) => {
        const headers = getHeaders();
        const parameters = JSON.stringify(params);

        return fetch(url, {
            ...headers,
            method: 'DELETE',
            body: parameters
        })
            .then((response) => handleResponseErrors(response, url))
            .then((response) => handleFlashMessage(response))
            .then((response) => handleResponse(response))
            .then(
                (json) => json,
                (error) => handleParseErrors(error, url)
            )
    }
};

export default api;
