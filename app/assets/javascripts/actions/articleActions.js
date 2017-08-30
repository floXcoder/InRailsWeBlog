'use strict';

// 'loadArticles',
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
// 'trackClick',
// 'trackView'

import {
    normalize
} from 'normalizr';

import api from '../middleware/api';

import * as ActionTypes from '../constants/actionTypes';
import {
    articleSchema
} from '../constants/schemas';

export const loadTagArticles = (tagId, parentTagSlug, childTagSlug) => (dispatch) => {
    // TODO
    // TagStore.onTrackClick(tagId);

    if (!$.isEmpty(childTagSlug)) {
        dispatch(push(`/article/tags/${parentTagSlug}/${childTagSlug}`));
    } else if (!$.isEmpty(parentTagSlug)) {
        dispatch(push(`/article/tags/${parentTagSlug}`));
    }
};

const fetchingArticles = () => ({
    type: ActionTypes.FETCH_ARTICLE_REQUEST,
    isFetching: true
});

const receiveArticles = (data) => ({
    type: ActionTypes.FETCH_ARTICLE_SUCCESS,
    isFetching: false,
    pagination: data.meta,
    normalizedArticles: normalize(data.articles, [articleSchema]),
});

export const loadArticles = (params) => (dispatch) => {
    dispatch(fetchingArticles());

    return api
        .get(`/articles`, params)
        .then((dataReceived) => {
            return dispatch(receiveArticles(dataReceived));
        });
};
