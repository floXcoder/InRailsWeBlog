'use strict';

// TODO
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

export const fetchArticle = (articleId, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    fetchAPI: () => api.get(`/articles/${articleId}`, {
        ...options
    })
});

// Article mutations
export const addArticle = (article, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.post(`/articles`, {
        article,
        ...options
    })
});

export const updateArticle = (article, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.update(`/articles/${article.id}`, {
        article,
        ...options
    })
});

export const deleteArticle = (articleId, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.delete(`/articles/${articleId}`, {
        ...options
    }),
    payload: {
        removedId: articleId
    }
});
