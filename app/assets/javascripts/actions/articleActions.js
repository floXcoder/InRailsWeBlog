'use strict';

// TODO
// 'loadArticle',
// 'addArticle',
// 'updateArticle',
// 'deleteArticle',
// 'autosaveArticle',
// 'loadArticleHistory',
// 'bookmarkArticle',
// 'voteArticle',
// 'outdateArticle',
// 'restoreArticle',

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Articles
export const fetchArticles = (filter = {}, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    fetchAPI: () => api.get(`/articles`, {
        filter,
        ...options
    })
});
