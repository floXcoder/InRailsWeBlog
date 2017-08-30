'use strict';

import fetch from 'isomorphic-fetch';
import qs from 'qs';

const headers = {
    credentials: 'same-origin',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
};

const api = {
    get: (url, params) => {
        const parameters = qs.stringify(params);
        const urlParams = parameters !== '' ? `${url}?${qs.stringify(params)}` : url;

        return fetch(urlParams, {
            ...headers,
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                return response;
            })
            .then((response) => response.json())
    },

    post: (url, params) => {
        const parameters = JSON.stringify(params);

        return fetch(url, {
            ...headers,
            method: 'POST',
            body: parameters,
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }

                return response;
            })
            .then((response) => response.json())
    }
};

export default api;
