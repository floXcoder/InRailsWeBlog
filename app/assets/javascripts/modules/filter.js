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
        let filteredArray = [];

        let initialArray = _.toArray(arrayOfObject);

        fuzzy.filter(filteringText, initialArray, {
            extract (element) {
                return element[propToFilter];
            }
        }).forEach(function (user) {
            filteredArray.push(initialArray[user.index]);
        }.bind(this));

        return filteredArray;
    }

    function filterObjectOfObject(objectOfObject, propToFilter, filteringText) {
        let filteredObject = [];

        let initialArray = _.toArray(objectOfObject);
        fuzzy.filter(filteringText, initialArray, {
            extract (element) {
                return element[propToFilter];
            }
        }).forEach(function (element) {
            let elementId = initialArray[element.index].id;
            filteredObject[elementId] = objectOfObject[elementId];
        }.bind(this));

        return filteredObject;
    }

    // Public API
    return {
        filterArrayOfObject: filterArrayOfObject,
        filterObjectOfObject: filterObjectOfObject
    };
}));
