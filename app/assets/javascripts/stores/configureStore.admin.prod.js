'use strict';

import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';

import fetchMiddleware from '../middlewares/fetch';
import mutationMiddleware from '../middlewares/mutation';

import adminReducers from '../reducers/admin';

const finalCreateStore = applyMiddleware(fetchMiddleware, mutationMiddleware, thunk)(createStore);

export const configureStore = finalCreateStore(adminReducers);

export default configureStore;
