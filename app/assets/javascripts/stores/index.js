import {
    createStore,
    applyMiddleware
} from 'redux';

import {
    thunk
} from 'redux-thunk';

import {
    loadingBarMiddleware
} from 'react-redux-loading-bar';

import fetchMiddleware from '@js/middlewares/fetch';
import mutationMiddleware from '@js/middlewares/mutation';

import createRootReducer from '@js/reducers';

const finalCreateStore = applyMiddleware(
    fetchMiddleware,
    mutationMiddleware,
    thunk,
    loadingBarMiddleware({
        promiseTypeSuffixes: ['FETCH_INIT', 'FETCH_SUCCESS', 'FETCH_ERROR']
    })
)(createStore);

export const configureStore = finalCreateStore(createRootReducer);

export default configureStore;
