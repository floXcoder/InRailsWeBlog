'use strict';

import _ from 'lodash';

import api from '../middlewares/api';

import History from '../modules/history';

import * as ActionTypes from '../constants/actionTypes';

import {
    spySearchResults
} from './metricsActions';

// Autocomplete
export const loadAutocomplete = (autocompleteParams) => (
    api.get('/api/v1/search/autocomplete', {
        search: autocompleteParams
    })
);

export const fetchAutocomplete = (autocompleteParams) => ({
    actionType: ActionTypes.SEARCH_AUTOCOMPLETE,
    fetchAPI: () => api.get('/api/v1/search/autocomplete', {
        search: autocompleteParams
    }),
    payload: {
        query: autocompleteParams.query
    }
});

const receiveAutocompleteAction = (keyCode) => ({
    type: ActionTypes.SEARCH_AUTOCOMPLETE_ACTION,
    keyCode
});
export const setAutocompleteAction = (keyCode) => (dispatch) => {
    // To ensure, action change before each key press
    dispatch(receiveAutocompleteAction());

    return dispatch(receiveAutocompleteAction(keyCode));
};

const tagSelection = (tag) => ({
    type: ActionTypes.SEARCH_TAG_SELECTED,
    tag
});

export const setSelectedTag = (tag) => (dispatch) => {
    return dispatch(tagSelection(tag));
};

// Search history
export const getSearchHistory = (params = {}) => (dispatch) => {
    const previousSearchData = History.getPreviousState('globalSearchData', {useUrlParams: true});
    const searchData = {...previousSearchData, ...params};

    if (!Utils.isEmpty(Utils.omit(searchData, ['locale', 'new_lang']))) {
        dispatch(fetchSearch(searchData, false));
    }
};

export const searchOnHistoryChange = () => (dispatch) => {
    History.onStateChange((newState) => {
        if (newState.globalSearchData) {
            dispatch(fetchSearch(newState.globalSearchData, false));
        }
    });
};

const _saveHistory = (searchState, searchData) => {
    if (!searchData) {
        const currentState = History.getPreviousState('globalSearchData');

        if (currentState) {
            searchData = currentState;
        } else {
            return;
        }
    }

    const _URLParams = _.merge({
            query: searchData.query
        },
        _.omit(_.merge({
            // test: null
        }, searchData), ['query'])
    );

    History.saveCurrentState(
        {
            globalSearchData: searchData
        },
        _URLParams
    );
};

// Search
const initSearch = () => ({
    type: ActionTypes.SEARCH_FETCH_INIT,
    isSearching: true
});
const failSearch = () => ({
    type: ActionTypes.SEARCH_FETCH_ERROR,
    isSearching: false
});
const receiveSearch = (searchParams, json, options = {}) => ({
    type: ActionTypes.SEARCH_FETCH_SUCCESS,
    isSearching: false,
    searchParams: searchParams,
    query: searchParams.query,
    aggregations: json.aggregations || {},
    suggestions: json.suggestions || {},
    totalCount: json.totalCount || {},
    totalPages: json.totalPages || {},
    topics: json.topics || [],
    tags: json.tags || [],
    articles: json.articles || [],
    topicFilters: options.filterType === 'topic' && options.filters,
    tagFilters: options.filterType === 'tag' && options.filters,
    articleFilters: options.filterType === 'article' && options.filters
});

const performSearch = (searchParams, options = {}) => (dispatch) => {
    dispatch(initSearch());

    return api
        .get('/api/v1/search', {search: searchParams})
        .promise
        .then(json => {
            if (json.errors) {
                return dispatch(failSearch(json));
            } else {
                spySearchResults(searchParams, json);

                return dispatch(receiveSearch(searchParams, json, options));
            }
        });
};

export const fetchSearch = (searchData, saveHistory = true) => (dispatch, getState) => {
    if (Utils.isEmpty(searchData)) {
        return;
    }

    const searchParams = {
        ...Utils.decodeObject(searchData)
    };

    if (saveHistory) {
        _saveHistory(getState().searchState, searchParams);
    }

    // Set default search parameters
    if (!searchParams.selectedTypes) {
        searchParams.selectedTypes = ['article', 'tag'];
    }

    return dispatch(performSearch(searchParams));
};

export const filterSearch = (filters, filterOptions) => (dispatch, getState) => {
    let searchParams = getState().searchState.searchParams.concat(filters).toJS();
    searchParams.page = 1;

    _saveHistory(getState().searchState, searchParams);

    return dispatch(performSearch(searchParams, {filters, ...filterOptions}));
};

// Meta search
// Not used for now
// const receiveMetaSearch = (query, json) => ({
//     type: ActionTypes.SEARCH_META_SUCCESS,
//     isSearching: false,
//     query,
//     metaResults: json
// });
//
// export const fetchMetaSearch = (query) => (dispatch) => {
//     dispatch(initSearch());
//
//     return api
//         .get(`/api/v1/search/meta`, {
//             search: {
//                 query
//             }
//         })
//         .then(json => dispatch(receiveMetaSearch(query, json)));
// };
