'use strict';

import _ from 'lodash';

import {
    parse
} from 'qs';

import urlParser from './urlParser';

const omitEmptyParams = (params) => _.omitBy(params, (value, key) => (Utils.isEmpty(value) || value === '') || (Utils.isEmpty(key) || key === ''));

const saveCurrentState = (paramsToSerialize, paramsToUrl, replaceOnly = false, reuseExistingParams = true) => {
    if (window.history?.pushState) {
        paramsToSerialize = omitEmptyParams(paramsToSerialize);

        const urlData = urlParser(location.href).data;
        let newPath = urlData.attr.path;
        const currentUrlParams = omitEmptyParams(urlData.param.query);

        const newParams = omitEmptyParams({...currentUrlParams, ...paramsToUrl});

        if (!Utils.isEmpty(Utils.toParams(newParams))) {
            newPath += '?' + Utils.toParams(newParams);
        }

        if (replaceOnly) {
            try {
                window.history.replaceState(paramsToSerialize, '', newPath);
            } catch(error) {
            }
        } else {
            try {
                window.history.pushState(paramsToSerialize, '', newPath);
            } catch(error) {
            }
        }

        return true;
    } else {
        return false;
    }
};

const getPreviousState = (dataName, options) => {
    let params = {};
    if (window.history?.state) {
        params = window.history.state;
    }

    if (params[dataName]) {
        let dataParams = params[dataName];

        if (options?.useUrlParams) {
            const urlParams = parse(window.location.search.substring(1));
            dataParams = _.merge(urlParams, dataParams);
        }

        return dataParams;
    } else if (options?.useUrlParams) {
        return parse(window.location.search.substring(1));
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
