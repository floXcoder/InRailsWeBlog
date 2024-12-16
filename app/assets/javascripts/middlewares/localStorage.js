
const localDataPrefix = 'INR-';

export const hasLocalStorage = !!window.localStorage;

export const saveLocalData = (dataName, dataParams) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;

        window.localStorage.setItem(currentItem, JSON.stringify(dataParams));
    }
};

export const saveLocalArray = (dataName, dataParams, concat = true) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;
        const previousData = window.localStorage.getItem(currentItem);
        let currentData = [];

        if (concat && previousData) {
            currentData = JSON.parse(previousData).concat(dataParams);
        } else {
            currentData = currentData.concat(dataParams);
        }

        window.localStorage.setItem(currentItem, JSON.stringify(currentData));
    }
};

export const getLocalData = (dataName, remove = false) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;
        const previousData = window.localStorage.getItem(currentItem);

        if (remove) {
            window.localStorage.removeItem(currentItem);
        }

        if (previousData) {
            return JSON.parse(previousData);
        }
    }
};

export const removeLocalData = (dataName) => {
    if (hasLocalStorage) {
        const currentItem = `${localDataPrefix}${dataName}`;
        return window.localStorage.removeItem(currentItem);
    }
};

export const getAllData = () => {
    const previousData = {};

    if (hasLocalStorage) {
        Object.entries(window.localStorage).forEach(([value, objKey]) => {
            if (objKey.startsWith(localDataPrefix)) {
                const previousDataName = objKey.replace(localDataPrefix, '');
                const previousDataParams = window.localStorage.getItem(objKey);

                if (previousDataParams) {
                    previousData[previousDataName] = JSON.parse(previousDataParams);
                }

                window.localStorage.removeItem(objKey);
            }
        });
    }

    return previousData;
};
