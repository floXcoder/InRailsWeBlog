'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

// Articles
export const fetchArticles = (filter = {}, options = {}, payload = {}) => ({
    actionType: ActionTypes.ARTICLE,
    fetchAPI: () => api.get(`/api/v1/articles`, {
        filter,
        ...options
    }),
    payload
});

export const fetchArticle = (articleId, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    fetchAPI: () => api.get(options.edit ? `/api/v1/articles/${articleId}/edit`: `/api/v1/articles/${articleId}`, {
        ...options
    })
});

// Article mutations
export const addArticle = (article, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.post(`/api/v1/articles`, {
        article,
        ...options
    })
});

export const inlineEditArticle = (articleId) => ({
    type: ActionTypes.ARTICLE_EDITION,
    articleId
});

export const updateArticle = (article, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.update(`/api/v1/articles/${article.id}`, {
        article,
        ...options
    })
});

export const updateArticlePriority = (articleIdsByPriority) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.update('/api/v1/articles/priority', {
        articleIds: articleIdsByPriority
    })
});

export const deleteArticle = (articleId, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.delete(`/api/v1/articles/${articleId}`, {
        ...options
    }),
    payload: {
        removedId: articleId
    }
});

// Article history
const receiveArticleVersions = (versions) => ({
    type: ActionTypes.ARTICLE_HISTORY,
    versions
});
export const fetchArticleHistory = (articleId) => (dispatch) => (
    api.get(`/api/v1/articles/${articleId}/history`)
        .promise
        .then((response) => dispatch(receiveArticleVersions(response.history)))
);

const receiveArticleRestored = (article) => ({
    type: ActionTypes.ARTICLE_RESTORE,
    article
});
export const restoreArticle = (articleId, versionId) => (dispatch) => (
    api.get(`/api/v1/articles/${articleId}/restore`, {
        versionId
    })
        .promise
        .then((response) => dispatch(receiveArticleRestored(response.article)))
);

// Article outdate
export const markArticleOutdated = (articleId) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.post(`/api/v1/articles/${articleId}/outdated`)
});

export const unmarkArticleOutdated = (articleId) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.delete(`/api/v1/articles/${articleId}/outdated`)
});
