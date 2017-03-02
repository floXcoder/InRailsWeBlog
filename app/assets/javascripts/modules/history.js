(function (root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], function ($) {
            return (root.returnExportsGlobal = factory($));
        });
    } else {
        // Global Variables
        root.returnExportsGlobal = factory(root.$);
    }
}(this, function ($) {
    'use strict';

    function saveCurrentState(paramsToSerialize, paramsToUrl, replaceOnly) {
        if (window.history && window.history.pushState) {
            var urlParams = $(window.location).attr('pathname');
            var previousParams = $.param(_.omit($.getUrlParameters(), Object.keys(paramsToUrl)));

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
    }

    function getPreviousState(dataName, options) {
        var params = {};
        if (window.history && window.history.state) {
            params = window.history.state;
        }

        if (params[dataName]) {
            var dataParams = params[dataName];

            if (options && options.useUrlParams) {
                var urlParams = $.getUrlParameters();
                dataParams = _.merge(urlParams, dataParams);
            }

            return dataParams;
        } else if (options && options.useUrlParams) {
            return $.getUrlParameters();
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
                    }
                }

                return true;
            };
        }
    }

    // Public API
    return {
        saveCurrentState: saveCurrentState,
        getPreviousState: getPreviousState,
        onStateChange: onStateChange
    };
}));
