'use strict';

import _ from 'lodash';

const localDataPrefix = 'sync-';

export const hasLocalStorage = !!window.localStorage;

export const saveLocalData = (dataName, dataParams) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;
        const previousData = JSON.parse(localStorage.getItem(currentItem));
        let currentData = [];

        if (previousData) {
            currentData = previousData.concat(dataParams);
        } else {
            currentData = currentData.concat(dataParams);
        }

        localStorage.setItem(currentItem, JSON.stringify(currentData));
    }
};

export const getLocalData = (dataName) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;
        const previousData = JSON.parse(localStorage.getItem(currentItem));

        return previousData;
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
