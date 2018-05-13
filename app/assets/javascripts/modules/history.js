'use strict';

import _ from 'lodash';

import urlParser from './urlParser';

const omitEmptyParams = (params) => _.omitBy(params, (value, key) => (Utils.isEmpty(value) || value === '') || (Utils.isEmpty(key) || key === ''));

const saveCurrentState = (paramsToSerialize, paramsToUrl, replaceOnly) => {
    if (window.history && window.history.pushState) {
        paramsToSerialize = omitEmptyParams(paramsToSerialize);

        const urlData = urlParser(location.href).data;
        let newPath = urlData.attr.path;
        paramsToUrl = omitEmptyParams(paramsToUrl);
        const currentUrlParams = omitEmptyParams(urlData.param.query);

        const newParams = {...currentUrlParams, ...paramsToUrl};

        if (!Utils.isEmpty($.param(paramsToUrl))) {
            newPath += '?' + $.param(newParams);
        }

        if (replaceOnly) {
            window.history.replaceState(paramsToSerialize, '', newPath);
        } else {
            window.history.pushState(paramsToSerialize, '', newPath);
        }

        return true;
    } else {
        return false;
    }
};

const getPreviousState = (dataName, options) => {
    let params = {};
    if (window.history && window.history.state) {
        params = window.history.state;
    }

    if (params[dataName]) {
        let dataParams = params[dataName];

        if (options && options.useUrlParams) {
            const urlParams = Utils.getUrlParameters();
            dataParams = _.merge(urlParams, dataParams);
        }

        return dataParams;
    } else if (options && options.useUrlParams) {
        return Utils.getUrlParameters();
    } else {
        return false;
    }
};

const onStateChange = (callback) => {
    if (window.history) {
        window.onpopstate = function (event) {
            if (typeof callback === 'function') {
                if (event.state) {
                    callback(event.state, document.location);
                } else {
                    window.location = event.target.location;
                }
            }

            return true;
        };
    }
};

// Public API
export default {
    saveCurrentState,
    getPreviousState,
    onStateChange
};
