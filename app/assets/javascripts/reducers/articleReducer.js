'use strict';

import {FETCH_ARTICLE_REQUEST, FETCH_ARTICLE_SUCCESS, FETCH_ARTICLE_FAILED} from '../constants/actionTypes';

const initState = {
    isFetching: false,
    result: [],
    articles: [],
    tags: [],
    users: []
};

export default function articleReducer(state = initState, action) {
    switch (action.type) {
        case FETCH_ARTICLE_REQUEST:
            return {
                ...state,
                isFetching: action.isFetching
            };
        case FETCH_ARTICLE_SUCCESS:
            return {
                ...state,
                isFetching: action.isFetching,
                result: action.normalizedArticles.result,
                articles: action.normalizedArticles.entities.articles,
                tags: action.normalizedArticles.entities.tags,
                users: action.normalizedArticles.entities.users
            };
        case FETCH_ARTICLE_FAILED:
            return {
                ...state,
                isFetching: false
            };
        default:
            return state;
    }
};
