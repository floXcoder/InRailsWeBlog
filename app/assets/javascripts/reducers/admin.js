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

import {
    reducer as formReducer
} from 'redux-form/immutable';

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

const ReducerRecord = Record({
    uiState: undefined,
    userState: undefined,
    adminState: undefined,
    autocompleteState: undefined,
    searchState: undefined,
    topicState: undefined,
    tagState: undefined,
    articleState: undefined,
    commentState: undefined,
    form: undefined,
    loadingBar: undefined
});

const rootAdminReducer = combineReducers({
    uiState: uiReducer,
    userState: userReducer,
    adminState: adminReducer,
    autocompleteState: autocompleteReducer,
    searchState: searchReducer,
    topicState: topicReducer,
    tagState: tagReducer,
    articleState: articleReducer,
    commentState: commentReducer,
    form: formReducer,
    loadingBar: loadingBarReducer
}, ReducerRecord);

export default rootAdminReducer;
