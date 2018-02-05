'use strict';

import {
    Record
} from 'immutable';

import {
    combineReducers
} from 'redux-immutable';

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
import errorReducer from './errorReducer';

const ReducerRecord = Record({
    uiState: undefined,
    form: undefined,
    userState: undefined,
    adminState: undefined,
    autocompleteState: undefined,
    searchState: undefined,
    topicState: undefined,
    tagState: undefined,
    articleState: undefined,
    commentState: undefined,
    errorState: undefined
});

const rootAdminReducer = combineReducers({
    uiState: uiReducer,
    form: formReducer,
    userState: userReducer,
    adminState: adminReducer,
    autocompleteState: autocompleteReducer,
    searchState: searchReducer,
    topicState: topicReducer,
    tagState: tagReducer,
    articleState: articleReducer,
    commentState: commentReducer,
    errorState: errorReducer
}, ReducerRecord);

export default rootAdminReducer;
