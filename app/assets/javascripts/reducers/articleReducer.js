'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    fetchReducer,
    mutationReducer,
    addOrReplaceIn,
    removeIn
} from './mutators';

const initState = {
    isFetching: false,
    isProcessing: false,
    errors: undefined,

    articles: [],
    pagination: {},

    homeArticles: [],
    popularArticles: [],

    article: undefined,
    articleEditionId: undefined,

    articleStories: undefined,

    articleVersions: undefined
};

export default function articleReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.ARTICLE_FETCH_INIT:
        case ActionTypes.ARTICLE_FETCH_SUCCESS:
        case ActionTypes.ARTICLE_FETCH_ERROR:
            return fetchReducer(state, action, (state) => {
                if (action.article) {
                    state.article = action.article;
                } else {
                    if (action.infinite) {
                        state.articles.push(...action.articles);
                    } else if (action.home) {
                        state.homeArticles = action.articles;
                    } else if (action.populars) {
                        state.popularArticles = action.articles;
                    } else {
                        state.articles = action.articles;
                    }
                }
            });

        case ActionTypes.ARTICLE_EDITION:
            state.articleEditionId = action.articleId;
            return state;

        case ActionTypes.ARTICLE_CHANGE_INIT:
        case ActionTypes.ARTICLE_CHANGE_SUCCESS:
        case ActionTypes.ARTICLE_CHANGE_ERROR:
            return mutationReducer(state, action, (state) => {
                if (action.articles) {
                    state.articles = action.articles;
                } else {
                    state.article = action.article;
                    if(action.removedId) {
                        removeIn(state.articles, action.removedId);
                    } else {
                        addOrReplaceIn(state.articles, action.article);
                    }
                }
            });

        // Topic stories
        case ActionTypes.ARTICLE_STORIES:
            state.articleStories = action.stories;
            return state;

        // History and restoration
        case ActionTypes.ARTICLE_HISTORY:
            state.articleVersions = action.versions;
            return state;

        case ActionTypes.ARTICLE_RESTORE:
            state.article = action.article;
            state.articleVersions = undefined;
            return state;

        default:
            return state;
    }
};
