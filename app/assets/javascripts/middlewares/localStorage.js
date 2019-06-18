'use strict';

import _ from 'lodash';

const localDataPrefix = 'INR-';

export const hasLocalStorage = !!window.localStorage;

export const saveLocalData = (dataName, dataParams) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;

        localStorage.setItem(currentItem, JSON.stringify(dataParams));
    }
};

export const saveLocalArray = (dataName, dataParams, concat = true) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;
        const previousData = localStorage.getItem(currentItem);
        let currentData = [];

        if (concat && previousData) {
            currentData = JSON.parse(previousData).concat(dataParams);
        } else {
            currentData = currentData.concat(dataParams);
        }

        localStorage.setItem(currentItem, JSON.stringify(currentData));
    }
};

export const getLocalData = (dataName, remove = false) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;
        const previousData = localStorage.getItem(currentItem);

        if (remove) {
            localStorage.removeItem(currentItem);
        }

        if (previousData) {
            return JSON.parse(previousData);
        }
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
                const previousDataParams = localStorage.getItem(objKey);

                if (previousDataParams) {
                    previousData[previousDataName] = JSON.parse(previousDataParams);
                }

                window.localStorage.removeItem(objKey);
            }
        });
    }

    return previousData;
};
