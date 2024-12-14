
import {
    produce
} from 'immer';

import {
    combineReducers
} from 'redux-immer';

import {
    loadingBarReducer
} from 'react-redux-loading-bar';

import adminReducer from '@js/reducers/adminReducer';
import userReducer from '@js/reducers/userReducer';
import topicReducer from '@js/reducers/topicReducer';
import tagReducer from '@js/reducers/tagReducer';
import articleReducer from '@js/reducers/articleReducer';
import {
    autocompleteReducer,
    searchReducer
} from '@js/reducers/searchReducer';
import commentReducer from '@js/reducers/commentReducer';

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
