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

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    String.prototype.toCamelCase = function () {
        // remove all characters that should not be in a variable name
        var string = this.replace(/([^a-zA-Z0-9_\- ])|^[_0-9]+/g, "").trim().toLowerCase();
        // uppercase letters preceded by a hyphen or a space or an underscore
        string = string.replace(/([ -_]+)([a-zA-Z0-9])/g, function (a, b, c) {
            return c.toUpperCase();
        });
        // uppercase letters following numbers
        string = string.replace(/([0-9]+)([a-zA-Z])/g, function (a, b, c) {
            return b + c.toUpperCase();
        });
        return string;
    };

    String.prototype.escapeRegexCharacters = function () {
        return this.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    String.prototype.caesarCipher = function (shift) {
        // Wrap the amount
        if (shift < 0) {
            return this.caesarCipher(shift + 26);
        }

        var output = '';

        // Go through each character
        for (var i = 0; i < this.length; i++) {

            // Get the character we'll be appending
            var c = this[i];

            // If it's a letter...
            if (c.match(/[a-z]/i)) {

                // Get its code
                var code = this.charCodeAt(i);

                // Uppercase letters
                if ((code >= 65) && (code <= 90))
                    c = String.fromCharCode(((code - 65 + shift) % 26) + 65);

                // Lowercase letters
                else if ((code >= 97) && (code <= 122))
                    c = String.fromCharCode(((code - 97 + shift) % 26) + 97);

            }

            output += c;
        }

        return output;
    };

    Array.prototype.limit = function (limit) {
        if (this && !!limit) {
            return this.slice(0, limit);
        } else {
            return this;
        }
    };

    Array.prototype.remove = function (item) {
        if (this) {
            var index = this.indexOf(item);

            if (index > -1) {
                return this.splice(index, 1);
            } else {
                return this;
            }
        }
    };

    Array.prototype.common = function (otherArray) {
        return this.filter(function (i) {
            return otherArray.indexOf(i) >= 0;
        });
    };

    // Attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time
        if (this.length !== array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] !== array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };

    Array.prototype.isEqualIds = function (other) {
        if (this.length !== other.length) {
            return false;
        }

        return this.every(function (element, index) {
            if (!other[index]) {
                return false;
            }

            return element.id === other[index].id;
        });
    };

    Array.prototype.first = function () {
        return this[0];
    };

    Array.prototype.last = function () {
        return this[this.length - 1];
    };

    Array.prototype.replace = function (key, newValue) {
        var newArray = [];
        this.forEach(function (oldValue, index, array) {
            if (oldValue[key] === newValue[key]) {
                newArray.push(newValue);
            } else {
                newArray.push(oldValue);
            }
        });
        return newArray;
    };

    Array.prototype.replaceOrAdd = function (key, newValue) {
        var newArray = [];
        var valueNotFound = true;
        this.forEach(function (oldValue, index, array) {
            if (oldValue[key] === newValue[key]) {
                newArray.push(newValue);
                valueNotFound = false;
            } else {
                newArray.push(oldValue);
            }
        });
        if (valueNotFound) {
            newArray.push(newValue);
        }
        return newArray;
    };

    $.fn.extend({
        // Refresh JQuery selector, but only for non-chained elements !
        update: function () {
            var newElements = jQuery(this.selector), i;
            for (i = 0; i < newElements.length; i++) {
                this[i] = newElements[i];
            }
            for (; i < this.length; i++) {
                this[i] = undefined;
            }
            this.length = newElements.length;
            return this;
        },

        goToTop: function () {
            this.on('click', function () {
                jQuery(document).scrollTop(0);
            });
        }
    });

    $.extend({
        uuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        isEmpty: function (obj) {
            // null and undefined are "empty"
            if (obj == null) return true;
            if (obj === 'undefined' || obj === 'null' || obj === 'false') return true;

            // Boolean are not empty
            if (obj === true || obj === false) return false;

            // Check if is a Integer
            if ($.isNumber(obj)) return false;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0)    return false;
            if (obj.length === 0)  return true;

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
            }

            return true;
        },

        isNumber: function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        isURL: function (url) {
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
        },

        // Create the following functions :
        // isArray
        // isObject
        // isString
        // isDate
        // isRegExp
        // isFunction
        // isBoolean
        // isNull
        // isUndefined
        // USage : $.is().isArray(myArray);
        is: function () {
            var exports = {};

            var types = 'Array Object String Date RegExp Function Boolean Null Undefined'.split(' ');

            var type = function () {
                return Object.prototype.toString.call(this).slice(8, -1);
            };

            for (var i = types.length; i--;) {
                exports['is' + types[i]] = (function (self) {
                    return function (obj) {
                        return type.call(obj) === self;
                    };
                })(types[i]);
            }

            return exports;
        },


        isSafari: function () {
            return navigator.appVersion.search('Safari') != -1
                && navigator.appVersion.search('Chrome') == -1
                && navigator.appVersion.search('CrMo') == -1
                && navigator.appVersion.search('CriOS') == -1;
        },

        isIe: function () {
            return navigator.userAgent.toLowerCase().indexOf("msie") != -1
                || navigator.userAgent.toLowerCase().indexOf("trident") != -1;
        },

        toMap: function (object, callback) {
            return Object.keys(object).map(function (key, i) {
                return callback(key, object[key], i);
            });
        },

        arraySearchForValue: function (arr, val, key) {
            for (var i = 0; i < arr.length; i++)
                if (arr[i][key] === val)
                    return arr[i];
            return false;
        },

        compareNumbers: function (a, b) {
            return a - b;
        },

        valuesInRange: function (arr, min, max) {
            arr = arr.sort($.compareNumbers);

            var len = arr.length,
                up = -1,
                down = len,
                rrange = [],
                mid = Math.floor(len / 2);
            while (up++ < mid && down-- > mid) {
                if (arr[up] >= max || arr[down] <= min) {
                    break;
                }
                if (arr[up] >= min) {
                    rrange.push(arr[up]);
                }
                if (arr[down] <= max) {
                    rrange.push(arr[down]);
                }
            }
            return rrange;
        },

        // Array must be sorted
        getClosestValues: function (array, value) {
            if ($.isEmpty(array)) return;

            var lo = -1, hi = array.length;
            while (hi - lo > 1) {
                var mid = Math.round((lo + hi) / 2);
                if (array[mid] <= value) {
                    lo = mid;
                } else {
                    hi = mid;
                }
            }
            if (array[lo] == value) hi = lo;
            return [array[lo], array[hi]];
        },

        // Array must be sorted
        getClosestValue: function (array, value) {
            if ($.isEmpty(array)) return;

            var lo = -1, hi = array.length;
            while (hi - lo > 1) {
                var mid = Math.round((lo + hi) / 2);
                if (array[mid] <= value) {
                    lo = mid;
                } else {
                    hi = mid;
                }
            }
            if (array[lo] == value) hi = lo;

            var lowDiff = Math.abs(array[lo] - value);
            var highDiff = Math.abs(array[hi] - value);

            if (lowDiff < highDiff) {
                return array[lo];
            }
            else {
                return array[hi];
            }
        },

        formatTime: function (totalMin, showZeroHours) {
            var hours = Math.floor(Math.floor(totalMin) / 60);
            var min = Math.floor(totalMin) % 60;
            var sec = Math.floor((totalMin - Math.floor(totalMin)) * 60.0);

            if (sec === 60) {
                sec = 0;
                min++;
            }

            if (min === 60) {
                min = 0;
                hours++;
            }

            var secStr = sec.toString();

            if (sec < 10) {
                secStr = '0' + secStr;
            }

            var minStr = min.toString();

            if (min < 10) {
                minStr = '0' + minStr;
            }

            if (showZeroHours || hours > 0) {
                return hours + ':' + minStr + ':' + secStr;
            }
            else {
                return minStr + ':' + secStr;
            }
        },

        getUrlPaths: function () {
            return window.location.pathname.split('/');
        },

        getUrlAnchor: function () {
            return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
        },

        // Use:
        // decodeURIComponent($.urlParam('distance_slider'))
        // $.urlParam('distance_slider')
        getUrlParameter: function (sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1];
                }
            }
        },

        getUrlParameters: function () {
            var query = window.location.search.substring(1);
            if (query == '') {
                return null;
            }

            var hash = {};
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                var k = decodeURIComponent(pair[0]);
                var v = decodeURIComponent(pair[1]);

                // If it is the first entry with this name
                if (typeof hash[k.substr(0, k.length - 2)] !== "undefined") {
                    hash[k.substr(0, k.length - 2)].push(v);
                } else if (typeof hash[k] === "undefined") {
                    // not end with []. cannot use negative index as IE doesn't understand it
                    if (k.substr(k.length - 2) != '[]') {
                        hash[k] = v;
                    }
                    else {
                        hash[k.substr(0, k.length - 2)] = [v];
                    }
                } else if (typeof hash[k] === "string") {
                    // If subsequent entry with this name and not array
                    hash[k] = v;  // replace it
                } else {
                    // If subsequent entry with this name and is array
                    hash[k.substr(0, k.length - 2)].push(v);
                }
            }

            return hash;
        },

        setUrlParameter: function (paramName, paramValue) {
            var url = window.location.href;
            if (url.indexOf(paramName + "=") >= 0) {
                var prefix = url.substring(0, url.indexOf(paramName));
                var suffix = url.substring(url.indexOf(paramName));
                suffix = suffix.substring(suffix.indexOf("=") + 1);
                suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
                url = prefix + paramName + "=" + paramValue + suffix;
            }
            else {
                if (url.indexOf("?") < 0)
                    url += "?" + paramName + "=" + paramValue;
                else
                    url += "&" + paramName + "=" + paramValue;
            }
            window.location.href = url;
        },

        fullDomainName: function () {
            return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        },

        distanceFunctions: {
            KM_PER_MILE: 1.609344,
            PI: 3.14159265358979323846
        },

        flooredNum: function (number, decimals) {
            var multiplier = Math.pow(10, decimals);
            return Math.floor((number) * multiplier) / multiplier;
        },

        NAVIGATION_KEYMAP: {
            //8: 'backspace',
            9: 'tab',
            13: 'enter',
            16: 'shift',
            17: 'ctrl',
            18: 'alt',
            20: 'capslock',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'ins',
            46: 'del',
            91: 'meta',
            93: 'meta',
            224: 'meta'
        },

        SPECIAL_KEYMAP: {
            106: '*',
            107: '+',
            109: '-',
            110: '.',
            111: '/',
            186: ';',
            187: '=',
            188: ',',
            189: '-',
            190: '.',
            191: '/',
            192: '`',
            219: '[',
            220: '\\',
            221: ']',
            222: '\''
        }
    });
}));
