'use strict';

import {
    createStore,
    applyMiddleware
} from 'redux';

import {
    composeWithDevTools
} from 'redux-devtools-extension';

import thunk from 'redux-thunk';

import fetchMiddleware from '../middlewares/fetch';
import mutationMiddleware from '../middlewares/mutation';

import adminReducers from '../reducers/admin';

const finalCreateStore = composeWithDevTools(applyMiddleware(fetchMiddleware, mutationMiddleware, thunk))(createStore);

export const configureStore = finalCreateStore(adminReducers);

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
        const nextRootReducer = require('../reducers').default;
        configureStore.replaceReducer(nextRootReducer);
    })
}

export default configureStore;
