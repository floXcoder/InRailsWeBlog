'use strict';

import {
    Record
} from 'immutable';

import {
    combineReducers
} from 'redux-immutable';

import {
    loadingBarReducer
} from 'react-redux-loading-bar';

import adminReducer from './adminReducer';
import userReducer from './userReducer';
import topicReducer from './topicReducer';
import tagReducer from './tagReducer';
import articleReducer from './articleReducer';
import {
    autocompleteReducer,
    searchReducer
} from './searchReducer';
import commentReducer from './commentReducer';

const ReducerRecord = Record({
    adminState: undefined,
    userState: undefined,
    topicState: undefined,
    tagState: undefined,
    articleState: undefined,
    autocompleteState: undefined,
    searchState: undefined,
    commentState: undefined,
    loadingBar: undefined
});

const rootAdminReducer = combineReducers({
    adminState: adminReducer,
    userState: userReducer,
    topicState: topicReducer,
    tagState: tagReducer,
    articleState: articleReducer,
    autocompleteState: autocompleteReducer,
    searchState: searchReducer,
    commentState: commentReducer,
    loadingBar: loadingBarReducer
}, ReducerRecord);

export default rootAdminReducer;
