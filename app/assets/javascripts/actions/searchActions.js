import * as Utils from '@js/modules/utils';

import api from '@js/middlewares/api';

import History from '@js/modules/history';
import Notification from '@js/modules/notification';

import * as ActionTypes from '@js/constants/actionTypes';

import AnalyticsService from '@js/modules/analyticsService';


// Autocomplete
export const loadAutocomplete = (autocompleteParams, withLocale = window.locale) => (
    api.get('/api/v1/search/autocomplete', {
        search: autocompleteParams,
        withLocale
    }, {
        noCache: true
    }).request
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
    }, {
        noCache: true
    }),
    payload: {
        query: autocompleteParams.query
    }
});

const receiveAutocompleteAction = (keyCode, currentUserId, currentTopicId) => ({
    type: ActionTypes.SEARCH_AUTOCOMPLETE_ACTION,
    keyCode,
    currentUserId,
    currentTopicId
});
export const setAutocompleteAction = (keyCode, currentUserId, currentTopicId) => (dispatch) => {
    // To ensure, action change before each key press
    dispatch(receiveAutocompleteAction());

    return dispatch(receiveAutocompleteAction(keyCode, currentUserId, currentTopicId));
};

const autocompleteTagSelection = (tag) => ({
    type: ActionTypes.SEARCH_AUTOCOMPLETE_TAG_SELECTED,
    tag
});
export const setAutocompleteSelectedTag = (tag) => (dispatch) => {
    return dispatch(autocompleteTagSelection(tag));
};

// Search
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
        Utils.isPresent(urlParams.filters)
    );
};

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
const receiveSearch = (searchParams, json) => ({
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
    scrapQuery: json.scrapQuery,
    meta: json.meta
});

const performSearch = (searchParams, options = {}) => (dispatch) => {
    dispatch(initSearch());

    return api
        .get('/api/v1/search', {
            locale: window.locale,
            search: searchParams
        }, {
            noCache: true
        })
        .request
        .then((response) => {
            if (!response || response.errors) {
                if (response.errors) {
                    Notification.error(response.errors);
                }

                return dispatch(failSearch(response));
            } else {
                AnalyticsService.trackSearch(searchParams, response);

                return dispatch(receiveSearch(searchParams, response, options));
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

    if (Utils.isPresent(searchData)) {
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

// Search inside URLs
const receiveUlSearch = (articleResults) => ({
    type: ActionTypes.SEARCH_URL_SCRAP,
    articleResults
});

export const searchInURLs = (urlData) => (dispatch) => {
    return api
        .post('/api/v1/search/url_search', urlData, true)
        .then((json) => dispatch(receiveUlSearch(json)));
};
