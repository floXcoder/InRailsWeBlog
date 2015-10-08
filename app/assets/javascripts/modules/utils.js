(function (root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define([], function () {
            return (root.returnExportsGlobal = factory());
        });
    } else {
        // Global Variables
        root.returnExportsGlobal = factory();
    }
}(this, function () {
    'use strict';

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    /**
     * Function which returns the result of the subtraction method applied to
     * sets (mathematical concept).
     *
     * @param a Array one
     * @param b Array two
     * @return An array containing the result
     */
    Array.prototype.common = function (a) {
        return this.filter(function (i) {
            return a.indexOf(i) >= 0;
        });
    };


// attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time
        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    };


    Array.prototype.first = function () {
        return this[0];
    };

    Array.prototype.last = function () {
        return this[this.length - 1];
    };


// Refresh JQuery selector, but only for non-chained elements !
    jQuery.fn.update = function () {
        var newElements = $(this.selector), i;
        for (i = 0; i < newElements.length; i++) {
            this[i] = newElements[i];
        }
        for (; i < this.length; i++) {
            this[i] = undefined;
        }
        this.length = newElements.length;
        return this;
    };


    var Utils = (function () {

        return {
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
                arr = arr.sort(Utils.compareNumbers);

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

            pad2: function (number) {
                return (number < 10 ? "0" : "") + number;
            },

            // pace in decimal minutes (per mi or km)
            formatPace: function (pace) {
                var avgPaceMin = Math.floor(pace);
                var avgPaceSec = Math.floor(Math.round((pace - avgPaceMin) * 60));

                if (avgPaceSec === 60) {
                    avgPaceSec = 0;
                    avgPaceMin++;
                }

                var avgPaceSecStr = avgPaceSec.toString();

                if (avgPaceSec < 10) {
                    avgPaceSecStr = '0' + avgPaceSecStr;
                }

                return avgPaceMin + ':' + avgPaceSecStr;
            },

            timeToSeconds: function (time) {
                var ref, hours, minutes;
                ref = time.split(':');
                hours = parseInt(ref[0], 10);
                minutes = parseInt(ref[1], 10);

                return hours * 60 + minutes;
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

            generateDataPointIndexes: function (chartData) {
                for (var i = 0; i < chartData.series.length; i++) {
                    if (chartData.series[i].data.length > 0) {
                        chartData.series[i].data = jQuery.map(chartData.series[i].data, function (value, index) {
                            if (value.length == undefined) {
                                return {y: value, index: index};
                            }
                            else if (value.length == 2) {
                                return {x: value[0], y: value[1], index: index};
                            }
                        });
                    }
                }
            },

            roundNumber: function (number, decimalPlaces) {
                var multiplier = Math.pow(10, decimalPlaces);
                return Math.round(number * multiplier) / multiplier;
            },

            showTab: function (event) {
                event.preventDefault();
                jQuery(this).tab('show');
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

            // Array must be sorted
            getClosestValues: function (array, value) {
                if ($app.utils.isEmpty(array)) return;

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
                if ($app.utils.isEmpty(array)) return;

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


            //$app.utils.isEmpty(""), // true
            //$app.utils.isEmpty([]), // true
            //$app.utils.isEmpty({}), // true
            //$app.utils.isEmpty({length: 0, custom_property: []}), // true
            isNumber: function (n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            },

            isEmpty: function (obj) {
                // null and undefined are "empty"
                if (obj == null) return true;
                if (obj === 'undefined' || obj === 'null' || obj === 'false') return true;

                // Check if is a Integer
                if (Utils.isNumber(obj)) return false;

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

            axis: function () {
                var exports = {};

                var types = 'Array Object String Date RegExp Function Boolean Number Null Undefined'.split(' ');

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

            fullDomainName: function () {
                var full = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                return full;
            },

            goToTop: function () {
                $( '.goto-top' ).on('click', function() {
                    $(document).scrollTop(0);
                });
            }
        };

    })();

    return Utils;
}));
