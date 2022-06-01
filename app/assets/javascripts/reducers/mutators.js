'use strict';

export const fetchReducer = (state, action, payloadReducer) => {
    const actionName = action.type.split('/')[1];

    if (!actionName) {
        throw new Error('To use fetchReducer, action name must respect format: TYPE/FETCH_');
    }

    const {
        // type,
        isFetching,
        meta,
        errors
    } = action;

    switch (actionName) {
        case 'FETCH_INIT':
            state.isFetching = isFetching;
            state.errors = {};
            break;
        case 'FETCH_SUCCESS':
            state.isFetching = isFetching;
            state.pagination = meta?.pagination || undefined;
            state.errors = {};
            payloadReducer(state);
            break;
        case 'FETCH_ERROR':
            state.isFetching = isFetching;
            state.errors = errors;
            break;
    }

    return state;
};

export const mutationReducer = (state, action, payloadReducer) => {
    const actionName = action.type.split('/')[1];

    if (!actionName) {
        throw new Error('To use fetchReducer, action name must respect format: TYPE/CHANGE_');
    }

    const {
        // type,
        isProcessing,
        // removedId,
        errors
    } = action;

    switch (actionName) {
        case 'CHANGE_INIT':
            state.isProcessing = isProcessing;
            state.errors = {};
            break;
        case 'CHANGE_SUCCESS':
            state.isProcessing = isProcessing;
            state.errors = {};
            payloadReducer(state);
            break;
        case 'CHANGE_ERROR':
            state.isProcessing = isProcessing;
            state.errors = errors;
            break;
    }

    return state;
};


export const findItemIndex = (list, itemId, id = 'id') => list.findIndex((item) => item[id] === itemId);

export const addOrReplaceIn = (itemArray, newItem, prepend = false, id = 'id') => {
    if (newItem) {
        let itemFound = false;
        itemArray.forEach((item, index, array) => {
            if (item[id] === newItem[id]) {
                array[index] = newItem;
                itemFound = true;
            }
        });

        if (!itemFound) {
            if (prepend) {
                itemArray.unshift(newItem);
            } else {
                itemArray.push(newItem);
            }
        }
    }

    return itemArray;
};

export const addOrRemoveIn = (itemArray, itemToRemove, prepend = false, id = 'id') => {
    if (itemToRemove) {
        let itemFound = false;
        itemArray.forEach((item, index, array) => {
            if (item[id] === itemToRemove[id]) {
                delete array[index];
                itemFound = true;
            }
        });

        if (!itemFound) {
            if (prepend) {
                itemArray.unshift(itemToRemove);
            } else {
                itemArray.push(itemToRemove);
            }
        }
    }

    return itemArray;
};

export const removeIn = (itemArray, removedId, id = 'id') => {
    if (removedId) {
        itemArray.splice(findItemIndex(itemArray, removedId, id), 1);
    }

    return itemArray;
};
