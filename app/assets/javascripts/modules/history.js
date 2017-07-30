'use strict';

import _ from 'lodash';

const saveCurrentState = (paramsToSerialize, paramsToUrl, replaceOnly) => {
    if (window.history && window.history.pushState) {
        let urlParams = $(window.location).attr('pathname');
        const previousParams = $.param(_.omit($.getUrlParameters(), Object.keys(paramsToUrl)));

        paramsToSerialize = _.omitBy(paramsToSerialize, function (value, key) {
            return ($.isEmpty(value) || value === '') || ($.isEmpty(key) || key === '');
        });
        paramsToUrl = _.omitBy(paramsToUrl, function (value, key) {
            return ($.isEmpty(value) || value === '') || ($.isEmpty(key) || key === '');
        });

        if (!$.isEmpty($.param(paramsToUrl))) {
            urlParams += '?' + ((previousParams && previousParams !== '' && previousParams !== '=') ? previousParams + '&' : '') + $.param(paramsToUrl);
        }

        if (replaceOnly) {
            window.history.replaceState(paramsToSerialize, '', urlParams);
        } else {
            window.history.pushState(paramsToSerialize, '', urlParams);
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
            let urlParams = $.getUrlParameters();
            dataParams = _.merge(urlParams, dataParams);
        }

        return dataParams;
    } else if (options && options.useUrlParams) {
        return $.getUrlParameters();
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
