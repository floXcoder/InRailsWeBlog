'use strict';

import _ from 'lodash';

const localDataPrefix = 'INR-';

export const hasLocalStorage = !!window.localStorage;

export const saveLocalData = (dataName, dataParams, concat = true) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;
        const previousData = JSON.parse(localStorage.getItem(currentItem));
        let currentData = [];

        if (concat && previousData) {
            currentData = previousData.concat(dataParams);
        } else {
            currentData = currentData.concat(dataParams);
        }

        localStorage.setItem(currentItem, JSON.stringify(currentData));
    }
};

export const getLocalData = (dataName, remove = false) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;
        const previousData = JSON.parse(localStorage.getItem(currentItem));

        if (remove) {
            localStorage.removeItem(currentItem);
        }

        return previousData;
    }
};

export const removeLocalData = (dataName) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;
        return localStorage.removeItem(currentItem);
    }
};

export const getAllData = () => {
    let previousData = {};

    if (hasLocalStorage) {
        _.forIn(window.localStorage, (value, objKey) => {
            if (true === _.startsWith(objKey, localDataPrefix)) {
                const previousDataName = objKey.replace(localDataPrefix, '');
                const previousDataParams = JSON.parse(localStorage.getItem(objKey));

                previousData[previousDataName] = previousDataParams;

                window.localStorage.removeItem(objKey);
            }
        });
    }

    return previousData;
};
