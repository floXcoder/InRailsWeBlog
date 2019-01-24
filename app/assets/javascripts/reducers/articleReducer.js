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
    metaTags: new Map(),
    pagination: new Map(),

    homeArticles: new List(),
    popularArticles: new List(),

    article: undefined,
    articleEditionId: undefined,

    articleStories: undefined,

    articleVersions: undefined
});

export default function articleReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.ARTICLE_FETCH_INIT:
        case ActionTypes.ARTICLE_FETCH_SUCCESS:
        case ActionTypes.ARTICLE_FETCH_ERROR:
            return fetchReducer(state, action, (payload) => {
                if (payload.article) {
                    return {
                        article: new Records.ArticleRecord(payload.article)
                    };
                } else {
                    if (payload.infinite) {
                        return {
                            articles: state.articles.concat(toList(payload.articles, Records.ArticleRecord))
                        };
                    } else if (payload.home) {
                        return {
                            homeArticles: toList(payload.articles, Records.ArticleRecord)
                        };
                    } else if (payload.populars) {
                        return {
                            popularArticles: toList(payload.articles, Records.ArticleRecord)
                        };
                    } else {
                        return {
                            articles: toList(payload.articles, Records.ArticleRecord)
                        };
                    }
                }
            }, ['infinite', 'home', 'populars']);

        case ActionTypes.ARTICLE_EDITION:
            return state.merge({
                articleEditionId: action.articleId
            });

        case ActionTypes.ARTICLE_CHANGE_INIT:
        case ActionTypes.ARTICLE_CHANGE_SUCCESS:
        case ActionTypes.ARTICLE_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) =>
                payload.articles ? ({
                    articles: toList(payload.articles, Records.ArticleRecord)
                }) : ({
                    article: payload.article && (new Records.ArticleRecord(payload.article)),
                    articles: mutateArray(state.articles, payload.article && (new Records.ArticleRecord(payload.article)), action.removedId)
                }) /*, ['article']*/);

        // Topic stories
        case ActionTypes.ARTICLE_STORIES:
            return state.merge({
                articleStories: toList(action.stories, Records.ArticleRecord)
            });

        // History and restoration
        case ActionTypes.ARTICLE_HISTORY:
            return state.merge({
                articleVersions: action.versions,
                metaTags: action.meta && action.meta.metaTags ? action.meta.metaTags : state.metaTags
            });

        case ActionTypes.ARTICLE_RESTORE:
            return state.merge({
                article: new Records.ArticleRecord(action.article),
                articleVersions: undefined
            });

        default:
            return state;
    }
};
