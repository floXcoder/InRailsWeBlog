(function (root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('fuzzy'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['fuzzy'], function (fuzzy) {
            return (root.returnExportsGlobal = factory(fuzzy));
        });
    } else {
        // Global Variables
        root.returnExportsGlobal = factory(root.fuzzy);
    }
}(this, function (fuzzy) {
    'use strict';

    function filterArrayOfObject(arrayOfObject, propToFilter, filteringText) {
        var filteredArray = [];

        var initialArray = _.toArray(arrayOfObject);

        fuzzy.filter(filteringText, initialArray, {
            extract : function (element) {
                return element[propToFilter];
            }
        }).forEach(function (user) {
            filteredArray.push(initialArray[user.index]);
        });

        return filteredArray;
    }

    function filterObjectOfObject(objectOfObject, propToFilter, filteringText) {
        var filteredObject = [];

        var initialArray = _.toArray(objectOfObject);
        fuzzy.filter(filteringText, initialArray, {
            extract : function (element) {
                return element[propToFilter];
            }
        }).forEach(function (element) {
            var elementId = initialArray[element.index].id;
            filteredObject[elementId] = objectOfObject[elementId];
        });

        return filteredObject;
    }

    // Public API
    return {
        filterArrayOfObject: filterArrayOfObject,
        filterObjectOfObject: filterObjectOfObject
    };
}));
