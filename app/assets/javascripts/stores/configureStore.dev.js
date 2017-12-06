'use strict';

import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';

import {
    routerMiddleware
} from 'react-router-redux';

import {
    composeWithDevTools
} from 'redux-devtools-extension';

import createBrowserHistory from 'history/createBrowserHistory';

import reducers from '../reducers';

export const browserHistory = createBrowserHistory();

const routeMiddleware = routerMiddleware(browserHistory);
const finalCreateStore = composeWithDevTools(applyMiddleware(thunk, routeMiddleware))(createStore);

export const configureStore = finalCreateStore(reducers);

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
        const nextRootReducer = require('../reducers').default;
        configureStore.replaceReducer(nextRootReducer);
    })
}

export default configureStore;
