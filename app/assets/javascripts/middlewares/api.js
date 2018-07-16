'use strict';

import 'isomorphic-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

import {
    stringify
} from 'qs';

import {
    pushError
} from '../actions/errorActions';

const getHeaders = () => {
    const csrfToken = document.getElementsByName('csrf-token')[0];
    const token = csrfToken && csrfToken.getAttribute('content');

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
    const token = csrfToken && csrfToken.getAttribute('content');

    return {
        credentials: 'same-origin',
        headers: new Headers({
            'X-CSRF-Token': token
        })
    };
};

const manageError = (origin, error, url) => {
    if (url === '/errors') {
        return;
    }

    let errorContent = {
        url,
        origin
    };

    if (error.statusText) {
        if (error.statusText === 'Forbidden') {
            Notification.error(I18n.t('js.helpers.errors.not_authorized'), 10);
            // if (document.referrer === '') {
            //     window.location = '/';
            // } else {
            //     history.back();
            // }
        } else if (error.statusText === 'Not found') {
            // Notification.error(I18n.t('js.helpers.errors.unprocessable'), 10);
        } else if (error.statusText === 'Unprocessable Entity') {
            Notification.error(I18n.t('js.helpers.errors.unprocessable'), 10);
        } else {
            if (error.statusText === 'Internal Server Error') {
                if (window.railsEnv === 'development') {
                    error.text().then((text) => log.now(text.split("\n").slice(0, 6)));
                } else {
                    Notification.error(I18n.t('js.helpers.errors.server'), 10);
                }
            }

            errorContent.message = error.statusText;

            pushError(errorContent);
        }
    } else {
        errorContent.message = error.message;
        errorContent.stack = error.stack;

        pushError(errorContent);
    }
};

const handleResponseErrors = (response, url) => {
    if (!response.ok) {
        manageError('client', response, url);
    }

    return response;
};

const handleParseErrors = (error, url) => {
    if (error.name === 'AbortError') {
        return;
    }

    manageError('communication', error, url);

    return {
        errors: error.message
    };
};

const handleFlashMessage = (response) => {
    let flashMessage = response.headers.get('X-Flash-Messages');

    if (flashMessage) {
        flashMessage = JSON.parse(decodeURIComponent(escape(flashMessage)));

        if (flashMessage && flashMessage.success) {
            Notification.success(flashMessage.success.replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }

        if (flashMessage && (flashMessage.notice || flashMessage.alert)) {
            Notification.alert((flashMessage.notice || flashMessage.alert).replace(/&amp;/g, '&').replace(/&gt;/g, '<').replace(/&lt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
        }

        if (flashMessage && flashMessage.error) {
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
            errors: status.error || response.statusText
        }));
    } else if (response.status !== 204) { // No content response
        return response.json();
    }
};

const api = {
    get: (url, params) => {
        const headers = getHeaders();
        const parameters = stringify(params, {arrayFormat: 'brackets'});
        const urlParams = parameters !== '' ? `${url}.json?${parameters}` : url;

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
                (error) => handleParseErrors(error, urlParams)
            );

        return {
            promise,
            controller
        };
    },

    post: (url, params, isData = false) => {
        const parameters = isData ? params : JSON.stringify(params);
        const postHeaders = isData ? getDataHeaders() : getHeaders();

        return fetch(url, {
            ...postHeaders,
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

    update: (url, params) => {
        const headers = getHeaders();
        const parameters = JSON.stringify(params);

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
