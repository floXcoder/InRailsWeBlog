'use strict';

import {
    Map,
    List
} from 'immutable';

export const fetchReducer = (state, action, payloadReducer, omitItems = []) => {
    const actionName = action.type.split('/')[1];

    if (!actionName) {
        throw new Error(`To use fetchReducer, action name must respect format: TYPE/FETCH_`);
    }

    const {type, isFetching, meta, ...actionContent} = action;

    switch (actionName) {
        case 'FETCH_INIT':
            return state.merge({
                isFetching,
                ...Utils.omit(actionContent, omitItems)
            });
        case 'FETCH_SUCCESS':
            return state.merge({
                isFetching,
                ...Utils.omit(actionContent, omitItems),
                ...payloadReducer({...actionContent, meta}),
                pagination: meta || {},
                errors: new Map()
            });
        case 'FETCH_ERROR':
            return state.merge({
                isFetching,
                ...Utils.omit(actionContent, omitItems)
            });
        default:
            return state;
    }
};

export const mutationReducer = (state, action, payloadReducer, omitItems = []) => {
    const actionName = action.type.split('/')[1];

    if (!actionName) {
        throw new Error(`To use fetchReducer, action name must respect format: TYPE/CHANGE_`);
    }

    const {type, isProcessing, removedId, ...actionContent} = action;

    switch (actionName) {
        case 'CHANGE_INIT':
            return state.merge({
                isProcessing,
                ...Utils.omit(actionContent, omitItems)
            });
        case 'CHANGE_SUCCESS':
            return state.merge({
                isProcessing,
                ...Utils.omit(actionContent, omitItems),
                ...payloadReducer(actionContent),
                errors: new Map()
            });
        case 'CHANGE_ERROR':
            return state.merge({
                isProcessing,
                ...Utils.omit(actionContent, omitItems)
            });
        default:
            return state;
    }
};

export const toList = (elements, record) => {
    if (elements) {
        return new List(elements.map(element => new record(element)));
    } else {
        return new List();
    }
};

// Multiple Mutations
// return pipe([
//     s => s.set('modalOpen', false),
//     s => s.set('loading', false)
// ], state)
const applyFn = (state, fn) => fn(state);
export const pipe = (fns, state) => state.withMutations(s => fns.reduce(applyFn, s));

export const findItemIndex = (list, itemId, id = 'id') => list.findIndex((item) => item.get(id) === itemId);

export const addOrRemoveArray = (itemArray, item, id = 'id') => {
    const itemIndex = findItemIndex(itemArray, item[id], id);
    return mutateArray(itemArray, item, itemIndex > -1 ? item[id] : null);
};

export const mutateArray = (itemArray, newItem, removedId = null, id = 'id') => {
    if (removedId) {
        return itemArray.update(items => items.filter((item) => item[id] !== removedId));
    } else if (newItem) {
        const index = newItem[id] && findItemIndex(itemArray, newItem[id], id);
        if (typeof index === 'undefined' || index === -1) {
            // Not found => add item to array
            return itemArray.update(items => items.concat([newItem]));
        } else {
            // Found => update item in array
            return itemArray.update(index, () => newItem);
        }
    } else {
        return itemArray;
    }
};
