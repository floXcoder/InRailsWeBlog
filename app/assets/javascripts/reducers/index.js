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

import {
    loadingBarReducer
} from 'react-redux-loading-bar';

import routerReducer from './routerReducer';
import uiReducer from './uiReducer';
import userReducer from './userReducer';
import bookmarkReducer from './bookmarkReducer';
import topicReducer from './topicReducer';
import tagReducer from './tagReducer';
import articleReducer from './articleReducer';
import {
    autocompleteReducer,
    searchReducer
} from './searchReducer';
import commentReducer from './commentReducer';

const ReducerRecord = Record({
    routerState: undefined,
    uiState: undefined,
    userState: undefined,
    bookmarkState: undefined,
    topicState: undefined,
    tagState: undefined,
    articleState: undefined,
    autocompleteState: undefined,
    searchState: undefined,
    commentState: undefined,
    form: undefined,
    loadingBar: undefined
});

const rootReducer = combineReducers({
    routerState: routerReducer,
    uiState: uiReducer,
    userState: userReducer,
    bookmarkState: bookmarkReducer,
    topicState: topicReducer,
    tagState: tagReducer,
    articleState: articleReducer,
    autocompleteState: autocompleteReducer,
    searchState: searchReducer,
    commentState: commentReducer,
    form: formReducer,
    loadingBar: loadingBarReducer
}, ReducerRecord);

export default rootReducer;
