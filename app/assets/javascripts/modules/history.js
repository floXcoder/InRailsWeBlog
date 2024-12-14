import {
    parse,
    stringify
} from 'qs';

import * as Utils from '@js/modules/utils';

import urlParser from '@js/modules/urlParser';


const History = (function () {
    function _omitEmptyParams(params) {
        const newObject = {};
        Object.entries(params).forEach(([key, value]) => {
            if (key !== '' && Utils.isPresent(key) && value !== '' && Utils.isPresent(value)) {
                newObject[key] = value;
            }
        });
        return newObject;
    }

    function saveCurrentState(paramsToSerialize, paramsToUrl, replaceOnly = false) {
        if (window.history?.pushState) {
            paramsToSerialize = _omitEmptyParams(paramsToSerialize);

            const urlData = urlParser(window.location.href).data;
            let newPath = urlData.attr.path;
            const currentUrlParams = _omitEmptyParams(urlData.param.query);

            const newParams = _omitEmptyParams({...currentUrlParams, ...paramsToUrl});

            const urlPathParams = stringify(newParams);

            if (Utils.isPresent(urlPathParams)) {
                newPath += '?' + urlPathParams;
            }

            if (replaceOnly) {
                try {
                    window.history.replaceState(paramsToSerialize, '', newPath);
                } catch (error) {
                    // Do nothing
                }
            } else {
                try {
                    window.history.pushState(paramsToSerialize, '', newPath);
                } catch (error) {
                    // Do nothing
                }
            }

            return true;
        } else {
            return false;
        }
    }

    function getPreviousState(dataName, options) {
        let params = {};
        if (window.history?.state) {
            params = window.history.state;
        }

        if (params[dataName]) {
            let dataParams = params[dataName];

            if (options?.useUrlParams) {
                const urlParams = parse(window.location.search.substring(1));
                dataParams = {...urlParams, ...dataParams};
            }

            return dataParams;
        } else if (options?.useUrlParams) {
            return parse(window.location.search.substring(1));
        } else {
            return false;
        }
    }

    function onStateChange(callback) {
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
    }

    return {
        saveCurrentState: saveCurrentState,
        getPreviousState: getPreviousState,
        onStateChange: onStateChange
    };
})();

export default History;
