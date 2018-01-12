'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Articles
export const fetchArticles = (filter = {}, options = {}, payload = {}) => ({
    actionType: ActionTypes.ARTICLE,
    fetchAPI: () => api.get(`/articles`, {
        filter,
        ...options
    }),
    payload
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

export const editArticle = (articleId) => ({
    type: ActionTypes.ARTICLE_EDITION,
    articleId
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

// Article history
// fetchArticleHistory
// const url = this.url + '/' + data.history + '/history';

// restoreArticle
// const url = this.url + '/' + data.restore.articleId + '/restore';
// version_id: data.restore.versionId

// Bookmarks
// const url = this.url + '/' + data.articleId + '/bookmark';

// Vote
// let url = this.url + '/' + data.articleId;
// if (data.isUp) {
//     url += '/vote_up';
// } else {
//     url += '/vote_down';
// }

// Outdated
// const url = this.url + '/' + data.articleId + '/outdate';
