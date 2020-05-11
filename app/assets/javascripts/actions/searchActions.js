'use strict';

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
    }).promise
);

const autocompleteQuery = (query) => ({
    type: ActionTypes.SEARCH_AUTOCOMPLETE_QUERY,
    query
});
export const setAutocompleteQuery = (query) => (dispatch) => {
    return dispatch(autocompleteQuery(query));
};

export const fetchAutocomplete = (autocompleteParams) => ({
    actionType: ActionTypes.SEARCH_AUTOCOMPLETE,
    fetchAPI: () => api.get('/api/v1/search/autocomplete', {
        locale: window.locale,
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

const autocompleteTagSelection = (tag) => ({
    type: ActionTypes.SEARCH_AUTOCOMPLETE_TAG_SELECTED,
    tag
});
export const setAutocompleteSelectedTag = (tag) => (dispatch) => {
    return dispatch(autocompleteTagSelection(tag));
};

const tagSelection = (tag) => ({
    type: ActionTypes.SEARCH_TAG_SELECTED,
    tag
});

export const setSelectedTag = (tag) => (dispatch) => {
    return dispatch(tagSelection(tag));
};

// Search history
export const getSearchContext = (params = {}) => (dispatch) => {
    const previousSearchData = History.getPreviousState('globalSearchData', {useUrlParams: true});

    if (Utils.isEmpty(previousSearchData) && params[0]) {
        previousSearchData.query = params[0];
    }

    delete params[0];

    const searchData = {...previousSearchData, ...params};

    if (!Utils.isEmpty(searchData)) {
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

    const urlParams = {
        query: searchData.query,
        ...searchData
    };

    History.saveCurrentState(
        {
            globalSearchData: searchData
        },
        urlParams,
        false,
        !Utils.isEmpty(urlParams.filters)
    );
};

// Search
const searchQuery = (query) => ({
    type: ActionTypes.SEARCH_SEARCH_QUERY,
    query
});
export const setSearchQuery = (query) => (dispatch) => {
    return dispatch(searchQuery(query));
};

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
    searchFilters: searchParams.filters || {},
    query: searchParams.query || '',
    selectedTags: json.selectedTags,
    aggregations: json.aggregations || {},
    suggestions: json.suggestions || {},
    totalCount: json.totalCount || {},
    totalPages: json.totalPages || {},
    topics: json.topics || [],
    tags: json.tags || [],
    articles: json.articles || [],
    meta: json.meta
});

const performSearch = (searchParams, options = {}) => (dispatch) => {
    dispatch(initSearch());

    return api
        .get('/api/v1/search', {
            locale: window.locale,
            search: searchParams
        })
        .promise
        .then((json) => {
            if (json.errors) {
                Notification.error(json.errors);

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

    // // Set default search parameters
    // if (!searchParams.selectedTypes) {
    //     searchParams.selectedTypes = ['article', 'tag'];
    // }

    return dispatch(performSearch(searchParams));
};

export const filterSearch = (filters) => (dispatch, getState) => {
    const searchParams = {...getState().searchState.searchParams, ...filters};

    _saveHistory(getState().searchState, searchParams);

    return dispatch(performSearch(searchParams, {filters}));
};
