'use strict';

import fuzzy from 'fuzzy';

export function fuzzyArrayFilter(arrayOfObject, propToFilter, filteringText) {
    let filteredArray = [];

    const initialArray = _.toArray(arrayOfObject);

    fuzzy.filter(filteringText, initialArray, {
        extract: function (element) {
            return element[propToFilter];
        }
    }).forEach(function (user) {
        filteredArray.push(initialArray[user.index]);
    });

    return filteredArray;
}

export function fuzzyObjectFilter(objectOfObject, propToFilter, filteringText) {
    let filteredObject = [];

    const initialArray = _.toArray(objectOfObject);
    fuzzy.filter(filteringText, initialArray, {
        extract: function (element) {
            return element[propToFilter];
        }
    }).forEach(function (element) {
        const elementId = initialArray[element.index].id;
        filteredObject[elementId] = objectOfObject[elementId];
    });

    return filteredObject;
}
