'use strict';

import {
    createMachine
} from '@xstate/fsm';

import * as ActionTypes from '../constants/actionTypes';

import {
    fetchReducer,
    mutationReducer,
    addOrReplaceIn,
    removeIn
} from './mutators';

const articleMachine = createMachine({
    id: 'articles',
    initial: 'idle',
    states: {
        idle: {
            on: {
                FETCH: 'fetching'
            }
        },
        fetching: {
            on: {
                LOAD: 'loaded',
                LOAD_USER: 'userLoaded',
                EMPTY: 'empty',
                EMPTY_USER: 'userEmpty'
            }
        },
        fetchingMore: {
            on: {
                LOAD: 'loaded',
                LOAD_USER: 'userLoaded'
            }
        },
        loaded: {
            on: {
                FETCH: 'fetching',
                FETCH_MORE: 'fetchingMore'
            }
        },
        userLoaded: {
            on: {
                FETCH: 'fetching',
                FETCH_MORE: 'fetchingMore'
            }
        },
        empty: {
            on: {
                FETCH: 'fetching'
            }
        },
        userEmpty: {
            on: {
                FETCH: 'fetching'
            }
        }
    }
});

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
    articleCurrentLanguage: undefined,

    articleRecommendations: undefined,

    articleTracking: undefined,

    articleVersions: undefined,

    currentState: articleMachine.initialState
};

export default function articleReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.ARTICLE_FETCH_INIT:
        case ActionTypes.ARTICLE_FETCH_SUCCESS:
        case ActionTypes.ARTICLE_FETCH_ERROR:
            if (action.isFetching) {
                state.currentState = articleMachine.transition(state.currentState, action.infinite ? 'FETCH_MORE' : 'FETCH');
            } else if (action.articles) {
                state.currentState = articleMachine.transition(state.currentState, (action.articles.length > 0 ? 'LOAD' : 'EMPTY') + (action.isOwner ? '_USER' : ''));
            }

            if (action.errors) {
                state.article = undefined;
                state.articleCurrentLanguage = undefined;
                state.articles = [];
                state.currentState = articleMachine.transition(state.currentState, 'EMPTY');
            }

            return fetchReducer(state, action, (newState) => {
                if (action.article) {
                    newState.article = action.article;
                    newState.articleCurrentLanguage = undefined;
                    newState.articleRecommendations = undefined;
                } else if (action.infinite) {
                    newState.articles.push(...action.articles);
                } else if (action.home) {
                    newState.homeArticles = action.articles;
                } else if (action.populars) {
                    newState.popularArticles = action.articles;
                } else {
                    newState.articles = action.articles;
                }
            });

        case ActionTypes.ARTICLE_LANGUAGE:
            state.articleCurrentLanguage = action.language;
            return state;

        case ActionTypes.ARTICLE_EDITION:
            state.articleEditionId = action.articleId;
            return state;

        case ActionTypes.ARTICLE_CHANGE_INIT:
        case ActionTypes.ARTICLE_CHANGE_SUCCESS:
        case ActionTypes.ARTICLE_CHANGE_ERROR:
            return mutationReducer(state, action, (newState) => {
                if (action.articles) {
                    newState.articles = action.articles;
                } else {
                    newState.article = action.article;
                    if (action.removedId) {
                        removeIn(newState.articles, action.removedId);
                    } else {
                        addOrReplaceIn(newState.articles, action.article);
                    }
                }
            });

        // Article recommendations
        case ActionTypes.ARTICLE_RECOMMENDATIONS:
            state.articleRecommendations = action.recommendations || [];
            return state;

        // Article tracking
        case ActionTypes.ARTICLE_TRACKING:
            state.articleTracking = action.tracking?.trackingData || {};
            if (action.tracking?.article) {
                state.article = action.tracking.article;
            }
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
}
