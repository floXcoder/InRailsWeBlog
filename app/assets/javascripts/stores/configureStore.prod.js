'use strict';

import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';

import fetchMiddleware from '../middlewares/fetch';
import mutationMiddleware from '../middlewares/mutation';

import reducers from '../reducers';

const finalCreateStore = applyMiddleware(fetchMiddleware, mutationMiddleware, thunk)(createStore);

export const configureStore = finalCreateStore(reducers);

export default configureStore;
