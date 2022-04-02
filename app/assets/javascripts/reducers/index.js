'use strict';

import produce, {
    enableES5
} from 'immer';

import {
    combineReducers
} from 'redux-immer';

import {
    loadingBarReducer
} from 'react-redux-loading-bar';

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

enableES5();

export default combineReducers(produce, {
    uiState: uiReducer,
    userState: userReducer,
    bookmarkState: bookmarkReducer,
    topicState: topicReducer,
    tagState: tagReducer,
    articleState: articleReducer,
    autocompleteState: autocompleteReducer,
    searchState: searchReducer,
    commentState: commentReducer,
    // form: formReducer,
    loadingBar: loadingBarReducer
});
