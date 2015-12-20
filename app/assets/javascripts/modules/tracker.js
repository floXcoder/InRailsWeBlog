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

    require('waypoints/lib/jquery.waypoints');

    // Clipboard event
    var Tracker = (function ($) {
        var trackViews = function ($trackedElement, callback) {
            $trackedElement.waypoint(
                function (direction) {
                    if (direction === 'down') {
                        if (callback) {
                            callback();
                        }
                    }
                },
                {
                    offset: function () {
                        return this.element.clientHeight
                    }
                }
            );
        };

        return {
            trackViews: trackViews
        };
    })($);

    return Tracker;
}));
