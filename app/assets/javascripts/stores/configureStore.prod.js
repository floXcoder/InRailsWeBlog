'use strict';

import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';

import {
    loadingBarMiddleware
} from 'react-redux-loading-bar';

import fetchMiddleware from '../middlewares/fetch';
import mutationMiddleware from '../middlewares/mutation';

import reducers from '../reducers';

const finalCreateStore = applyMiddleware(
    fetchMiddleware,
    mutationMiddleware,
    thunk,
    loadingBarMiddleware({
        promiseTypeSuffixes: ['FETCH_INIT', 'FETCH_SUCCESS', 'FETCH_ERROR']
    })
)(createStore);

export const configureStore = finalCreateStore(reducers);

export default configureStore;
