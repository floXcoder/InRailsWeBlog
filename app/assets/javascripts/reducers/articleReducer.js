'use strict';

import {
    Record,
    Map,
    List
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

import {
    toList,
    fetchReducer,
    mutationReducer,
    mutateArray
} from './mutators';

const initState = new Record({
    isFetching: false,
    isProcessing: false,
    errors: new Map(),

    articles: new List(),
    pagination: new Map()
});

export default function articleReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.ARTICLE_FETCH_INIT:
        case ActionTypes.ARTICLE_FETCH_SUCCESS:
        case ActionTypes.ARTICLE_FETCH_ERROR:
            return fetchReducer(state, action, (payload) => ({
                articles: toList(payload.articles, Records.ArticleRecord)
            }));

        case ActionTypes.ARTICLE_CHANGE_INIT:
        case ActionTypes.ARTICLE_CHANGE_SUCCESS:
        case ActionTypes.ARTICLE_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) => ({
                article: payload.article ? new Records.ArticleRecord(payload.article) : undefined
            }));

        default:
            return state;
    }
};
