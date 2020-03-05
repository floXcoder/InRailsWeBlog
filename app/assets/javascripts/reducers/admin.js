'use strict';

import produce, {enableES5} from 'immer';

import {
    combineReducers
} from 'redux-immer';

import {
    loadingBarReducer
} from 'react-redux-loading-bar';

enableES5();

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

export default combineReducers(produce, {
    adminState: adminReducer,
    userState: userReducer,
    topicState: topicReducer,
    tagState: tagReducer,
    articleState: articleReducer,
    autocompleteState: autocompleteReducer,
    searchState: searchReducer,
    commentState: commentReducer,
    loadingBar: loadingBarReducer
});
