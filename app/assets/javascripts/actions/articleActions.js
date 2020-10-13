'use strict';

import * as ActionTypes from '../constants/actionTypes';

import api from '../middlewares/api';

import {
    convertJsonApi
} from '../middlewares/json';

// Articles
export const fetchArticles = (filter = {}, options = {}, payload = {}) => ({
    actionType: ActionTypes.ARTICLE,
    fetchAPI: () => api.get('/api/v1/articles', {
        locale: window.locale,
        filter,
        ...options
    }),
    localData: options.localArticles,
    payload
});

export const fetchArticle = (userId, articleId, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    fetchAPI: () => api.get(options.edit ? `/api/v1/articles/${articleId}/edit` : `/api/v1/articles/${articleId}`, {
        locale: window.locale,
        userId: userId,
        ...options
    }),
    localData: options.localArticle
});

export const fetchSharedArticle = (articleId, publicLink, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    fetchAPI: () => api.get(`/api/v1/articles/${articleId}/shared/${publicLink}`, {
        locale: window.locale,
        ...options
    })
});

export const checkLinksArticle = (articleId, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.post(`/api/v1/articles/${articleId}/check-links`, {
        ...options
    }),
    payload: {
        removedId: articleId
    }
});

// Article mutations
export const addArticle = (article, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.post('/api/v1/articles', {
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

// Article stories
const receiveRecommendations = ({recommendations}) => ({
    type: ActionTypes.ARTICLE_RECOMMENDATIONS,
    recommendations
});
export const fetchRecommendations = (userId, articleId) => (dispatch) => (
    api.get(`/api/v1/articles/${articleId}/recommendations`, {
        locale: window.locale,
        userId
    })
        .promise
        .then((response) => dispatch(receiveRecommendations(convertJsonApi(response))))
);

// Article history
const receiveArticleVersions = ({history, meta}) => ({
    type: ActionTypes.ARTICLE_HISTORY,
    versions: history,
    meta
});
export const fetchArticleHistory = (articleId) => (dispatch) => (
    api.get(`/api/v1/articles/${articleId}/history`)
        .promise
        .then((response) => dispatch(receiveArticleVersions(convertJsonApi(response))))
);

const receiveArticleRestored = ({article}) => ({
    type: ActionTypes.ARTICLE_RESTORE,
    article
});
export const restoreArticle = (articleId, versionId) => (dispatch) => (
    api.get(`/api/v1/articles/${articleId}/restore`, {
        versionId
    })
        .promise
        .then((response) => dispatch(receiveArticleRestored(convertJsonApi(response))))
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
