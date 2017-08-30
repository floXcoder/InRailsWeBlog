'use strict';

import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';

import {
    routerMiddleware
} from 'react-router-redux';

import createBrowserHistory from 'history/createBrowserHistory';

import reducers from '../reducers';

export const browserHistory = createBrowserHistory();

const routeMiddleware = routerMiddleware(browserHistory);
const finalCreateStore = applyMiddleware(thunk, routeMiddleware)(createStore);

export const configureStore = finalCreateStore(reducers);

export default configureStore;
