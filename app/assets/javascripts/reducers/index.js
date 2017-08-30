'use strict';

import {
    combineReducers
} from 'redux';

import {
    routerReducer
} from 'react-router-redux';

import uiReducer from './uiReducer';
import userReducer from './userReducer';
import articleReducer from './articleReducer';
import topicReducer from './topicReducer';
import tagReducer from './tagReducer';
import adminReducer from './adminReducer';

const rootReducer = combineReducers({
    router: routerReducer,
    uiState: uiReducer,
    userState: userReducer,
    articleState: articleReducer,
    topicState: topicReducer,
    tagState: tagReducer,
    adminReducer: adminReducer
});

export default rootReducer;
