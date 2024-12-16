
import {
    produce
} from 'immer';

import {
    combineReducers
} from 'redux-immer';

import {
    loadingBarReducer
} from 'react-redux-loading-bar';

import uiReducer from '@js/reducers/uiReducer';
import userReducer from '@js/reducers/userReducer';
import bookmarkReducer from '@js/reducers/bookmarkReducer';
import topicReducer from '@js/reducers/topicReducer';
import tagReducer from '@js/reducers/tagReducer';
import articleReducer from '@js/reducers/articleReducer';
import {
    autocompleteReducer,
    searchReducer
} from '@js/reducers/searchReducer';
import commentReducer from '@js/reducers/commentReducer';

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
