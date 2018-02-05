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

import reducers from '../reducers';

const finalCreateStore = composeWithDevTools(applyMiddleware(fetchMiddleware, mutationMiddleware, thunk))(createStore);

export const configureStore = finalCreateStore(reducers);

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
        const nextRootReducer = require('../reducers').default;
        configureStore.replaceReducer(nextRootReducer);
    })
}

export default configureStore;
