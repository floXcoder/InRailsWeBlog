
import * as ActionTypes from '@js/constants/actionTypes';

import api from '@js/middlewares/api';

import {
    convertJsonApi
} from '@js/middlewares/json';


// Articles
export const fetchArticles = (filter = {}, options = {}, payload = {}, requestOptions = {}) => ({
    actionType: ActionTypes.ARTICLE,
    fetchAPI: () => api.get('/api/v1/articles', {
        locale: window.locale,
        filter,
        ...options
    }, requestOptions),
    localData: requestOptions.localArticles,
    payload
});

export const fetchArticle = (userId, articleId, options = {}, requestOptions = {}) => ({
    actionType: ActionTypes.ARTICLE,
    fetchAPI: () => api.get(options.edit ? `/api/v1/articles/${articleId}/edit` : `/api/v1/articles/${articleId}`, {
        locale: window.locale,
        userId: userId,
        ...options
    }, requestOptions),
    localData: requestOptions.localArticle
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

export const changeArticleLanguage = (language) => ({
    type: ActionTypes.ARTICLE_LANGUAGE,
    language
});

export const showArticleContent = (articleContent) => ({
    type: ActionTypes.ARTICLE_TITLE_CONTENT,
    articleContent
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

export const archiveArticle = (articleId, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.post(`/api/v1/articles/${articleId}/archived`, {
        ...options
    })
});

export const unarchiveArticle = (articleId, options = {}) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.delete(`/api/v1/articles/${articleId}/archived`, {
        ...options
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
const receiveArticleRecommendations = (json) => ({
    type: ActionTypes.ARTICLE_RECOMMENDATIONS,
    recommendations: json?.recommendations
});
export const fetchArticleRecommendations = (userId, articleId) => (dispatch) => (
    api.get(`/api/v1/articles/${articleId}/recommendations`, {
        locale: window.locale,
        userId
    }, {
        priorityLow: true
    })
        .request
        .then((response) => dispatch(receiveArticleRecommendations(convertJsonApi(response))))
);

// Article tracking
const receiveArticleTracking = (tracking) => ({
    type: ActionTypes.ARTICLE_TRACKING,
    tracking
});
export const fetchArticleTracking = (articleId, userId, options = {}) => (dispatch) => (
    api.get(`/api/v1/articles/${articleId}/tracking`, {
        locale: window.locale,
        userId,
        ...options
    })
        .request
        .then((response) => dispatch(receiveArticleTracking(response)))
);

// Article history
const receiveArticleVersions = ({history, meta}) => ({
    type: ActionTypes.ARTICLE_HISTORY,
    versions: history,
    meta
});
export const fetchArticleHistory = (articleId) => (dispatch) => (
    api.get(`/api/v1/articles/${articleId}/history`)
        .request
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
        .request
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
