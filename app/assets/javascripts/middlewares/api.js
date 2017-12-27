'use strict';

import 'isomorphic-fetch';

import {
    stringify
} from 'qs';

import {
    pushError
} from '../actions/errorActions';

const token = $('meta[name="csrf-token"]').attr('content');

const headers = {
    credentials: 'same-origin',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
    }
};

const manageError = (origin, error, url) => {
    let errorContent = {
        url,
        origin
    };

    if (error.statusText) {
        if (error.statusText === 'Forbidden') {
            Notification.error(I18n.t('js.helpers.errors.not_authorized'), 10);
        } else {
            if (error.statusText === 'Unprocessable Entity') {
                Notification.error(I18n.t('js.helpers.errors.unprocessable'), 10);
            } else if (error.statusText === 'Internal Server Error') {
                if (window.railsEnv === 'development') {
                    error.text().then((text) => {
                        log.now(text.split("\n").slice(0, 6));
                    });
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
        manageError('response', response, url);
    }

    return response;
};

const handleParseErrors = (error, url) => {
    manageError('communication', error, url);

    return {
        errors: error.message
    };
};

const handleFlashMessage = (response) => {
    let flashMessage = response.headers.get("X-Flash-Messages");

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

const api = {
    get: (url, params) => {
        const parameters = stringify(params, {arrayFormat: 'brackets'});
        const urlParams = parameters !== '' ? `${url}?${parameters}` : url;

        return fetch(urlParams, {
            ...headers,
            method: 'GET',
        })
        // TODO : manage 404 response in handleResponseErrors => e.g. user validation : infinite loop if 404 returned
            // .then((response) => handleResponseErrors(response, urlParams))
            // .then((response) => handleFlashMessage(response))
            .then((response) => response.json())
            .then(
                (json) => json,
                (error) => handleParseErrors(error, urlParams)
            )
    },

    post: (url, params) => {
        const parameters = JSON.stringify(params);

        return fetch(url, {
            ...headers,
            method: 'POST',
            body: parameters,
        })
            .then((response) => handleResponseErrors(response, url))
            .then((response) => handleFlashMessage(response))
            .then((response) => {
                if (response.status !== 204) { // No content response
                    return response.json();
                }
            })
            .then(
                (json) => json,
                (error) => handleParseErrors(error, url)
            )
    },

    update: (url, params) => {
        const parameters = JSON.stringify(params);

        return fetch(url, {
            ...headers,
            method: 'PUT',
            body: parameters
        })
            .then((response) => handleResponseErrors(response, url))
            .then((response) => handleFlashMessage(response))
            .then((response) => {
                if (response.status !== 204) { // No content response
                    return response.json();
                }
            })
            .then(
                (json) => json,
                (error) => handleParseErrors(error, url)
            )
    },

    delete: (url, params) => {
        const parameters = JSON.stringify(params);

        return fetch(url, {
            ...headers,
            method: 'DELETE',
            body: parameters
        })
            .then((response) => handleResponseErrors(response, url))
            .then((response) => handleFlashMessage(response))
            .then((response) => {
                if (response.status !== 204) { // No content response
                    return response.json();
                }
            })
            .then(
                (json) => json,
                (error) => handleParseErrors(error, url)
            )
    }
};

export default api;
