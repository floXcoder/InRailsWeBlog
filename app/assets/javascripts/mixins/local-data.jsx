'use strict';

const LocalDataMixin = (superclass) => class extends superclass {
    static hasLocalStorage = !!window.localStorage;
    static localDataPrefix = 'sync-';

    static saveLocalData(dataName, dataParams) {
        if (this.hasLocalStorage) {
            const currentItem = `${this.localDataPrefix}${dataName}`;
            const previousData = JSON.parse(localStorage.getItem(currentItem));
            let currentData = [];

            if (previousData) {
                currentData = previousData.concat(dataParams);
            } else {
                currentData = currentData.concat(dataParams);
            }

            localStorage.setItem(currentItem, JSON.stringify(currentData));
        }
    }

    static getLocalData(dataName) {
        if (this.hasLocalStorage) {
            const currentItem = `${this.localDataPrefix}${dataName}`;
            const previousData = JSON.parse(localStorage.getItem(currentItem));

            return previousData;
        }
    }

    static getAllData() {
        let previousData = {};

        if (this.hasLocalStorage) {
            _.forIn(window.localStorage, (value, objKey) => {
                if (true === _.startsWith(objKey, this.localDataPrefix)) {
                    const previousDataName = objKey.replace(this.localDataPrefix, '');
                    const previousDataParams = JSON.parse(localStorage.getItem(objKey));

                    previousData[previousDataName] = previousDataParams;

                    window.localStorage.removeItem(objKey);
                }
            });
        }

        return previousData;
    }

    constructor() {
        super();
    }
};

export default LocalDataMixin;
