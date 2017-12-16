'use strict';

import {
    Record
} from 'immutable';

import {
    combineReducers
} from 'redux-immutable';

import uiReducer from './uiReducer';
import userReducer from './userReducer';
import adminReducer from './adminReducer';
import {
    autocompleteReducer,
    searchReducer
} from './searchReducer';
import topicReducer from './topicReducer';
import tagReducer from './tagReducer';
import articleReducer from './articleReducer';
import commentReducer from './commentReducer';
import errorReducer from './errorReducer';

const ReducerRecord = Record({
    uiState: undefined,
    userState: undefined,
    topicState: undefined,
    tagState: undefined,
    articleState: undefined,
    autocompleteState: undefined,
    searchState: undefined,
    commentState: undefined,
    errorState: undefined,
    adminState: undefined
});

const rootReducer = combineReducers({
    uiState: uiReducer,
    userState: userReducer,
    topicState: topicReducer,
    tagState: tagReducer,
    articleState: articleReducer,
    autocompleteState: autocompleteReducer,
    searchState: searchReducer,
    commentState: commentReducer,
    errorState: errorReducer,
    adminState: adminReducer
}, ReducerRecord);

export default rootReducer;
