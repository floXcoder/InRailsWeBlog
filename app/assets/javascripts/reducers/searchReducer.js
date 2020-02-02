'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    fetchReducer,
    findItemIndex,
    addOrRemoveIn,
    removeIn,
    addOrReplaceIn
} from './mutators';

// Autocomplete
const autocompleteState = {
    // Required for fetchReducer/mutationReducer
    isFetching: false,
    pagination: {},
    errors: {},

    query: '',

    metaTags: {},

    highlightedTag: undefined,
    highlightedArticle: undefined,

    selectedTags: [],

    topics: [],
    tags: [],
    articles: []
};

export function autocompleteReducer(state = autocompleteState, action) {
    switch (action.type) {
        case ActionTypes.SEARCH_AUTOCOMPLETE_QUERY:
            state.query = action.query;
            return state;

        case ActionTypes.SEARCH_AUTOCOMPLETE_FETCH_INIT:
        case ActionTypes.SEARCH_AUTOCOMPLETE_FETCH_SUCCESS:
        case ActionTypes.SEARCH_AUTOCOMPLETE_FETCH_ERROR:
            return fetchReducer(state, action, (state) => {
                // query: payload.query,
                state.highlightedTag = undefined;
                state.highlightedArticle = undefined;
                state.topics = action.topics || [];
                state.tags = action.tags || [];
                state.articles = action.articles || [];
            });

        case ActionTypes.SEARCH_AUTOCOMPLETE_ACTION:
            let newTag;
            let newArticle;

            if (action.keyCode === 'ArrowUp') {
                if (!state.highlightedTag && !state.highlightedArticle) {
                    if (state.articles.last()) {
                        newArticle = state.articles.last();
                    } else if (state.tags.first()) {
                        newTag = state.tags.last();
                    }
                } else if (state.tags.first() && state.highlightedTag && state.highlightedTag.id === state.tags.first().id) {
                    newArticle = state.articles.last();
                    newTag = undefined;
                } else if (state.highlightedTag) {
                    newTag = state.tags[findItemIndex(state.tags, state.highlightedTag.id) - 1];
                } else if (state.highlightedArticle && state.highlightedArticle.id === state.articles.first().id) {
                    newArticle = state.articles.first();
                    newTag = undefined;
                } else if (state.highlightedArticle) {
                    newArticle = state.articles[findItemIndex(state.articles, state.highlightedArticle.id) - 1];
                }

                state.highlightedTag = newTag;
                state.highlightedArticle = newArticle;
            } else if (action.keyCode === 'ArrowDown') {
                if (!state.highlightedTag && !state.highlightedArticle) {
                    if (state.tags.first()) {
                        newTag = state.tags.first();
                    } else if (state.articles.first()) {
                        newArticle = state.articles.first();
                    }
                } else if (state.tags.last() && state.highlightedTag && state.highlightedTag.id === state.tags.last().id) {
                    newArticle = state.articles.first();
                    newTag = undefined;
                } else if (state.highlightedTag) {
                    newTag = state.tags[findItemIndex(state.tags, state.highlightedTag.id) + 1];
                } else if (state.articles.last() && state.highlightedArticle && state.highlightedArticle.id === state.articles.last().id) {
                    newTag = state.tags.first();
                    newArticle = undefined;
                } else if (state.highlightedArticle) {
                    newArticle = state.articles[findItemIndex(state.articles, state.highlightedArticle.id) + 1];
                }

                state.highlightedTag = newTag;
                state.highlightedArticle = newArticle;
            } else if (action.keyCode === 'Tab') {
                state.query = '';
                state.selectedTags = addOrRemoveIn(state.selectedTags, state.tags[findItemIndex(state.tags, state.highlightedTag ? state.highlightedTag.id : state.tags.first().id)]);
                state.topics = [];
                state.tags = [];
                state.articles = [];
                state.highlightedTag = undefined;
                state.highlightedArticle = undefined;
            } else if (action.keyCode === 'Enter') {
                if (state.highlightedTag) {
                    state.query = '';
                    state.selectedTags = addOrRemoveIn(state.selectedTags, state.tags[findItemIndex(state.tags, state.highlightedTag.id)]);
                    state.topics = [];
                    state.tags = [];
                    state.articles = [];
                    state.highlightedTag = undefined;
                    state.highlightedArticle = undefined;
                } else if (state.highlightedArticle) {
                    state.query = '';
                    state.topics = [];
                    state.tags = [];
                    state.articles = [];
                    state.highlightedTag = undefined;
                    state.highlightedArticle = undefined;
                }
            } else if (action.keyCode === 'Escape') {
                state.highlightedTag = undefined;
                state.highlightedArticle = undefined;
            } else if (action.keyCode === 'Backspace') {
                state.selectedTags = state.tags.count() > 0 ? addOrRemoveIn(state.selectedTags, state.tags.last()) : state.tags;
                state.topics = [];
                state.tags = [];
                state.articles = [];
                state.highlightedTag = undefined;
                state.highlightedArticle = undefined;
            }
            return state;

        case ActionTypes.SEARCH_AUTOCOMPLETE_TAG_SELECTED:
            state.selectedTags = action.tag ? addOrRemoveIn(state.selectedTags, action.tag) : [];
            state.topics = [];
            state.tags = [];
            state.articles = [];
            return state;

        case ActionTypes.SEARCH_FETCH_SUCCESS:
            state.highlightedTag = undefined;
            state.highlightedArticle = undefined;
            return state;

        default:
            return state;
    }
}

// Search
const searchState = {
    isSearching: false,
    hasResults: false,
    hasSearched: false,

    searchParams: {},
    searchFilters: {},
    selectedTypes: ['article'], // initial query
    articleAvailableFilters: [],

    query: '',

    metaTags: {},

    selectedTags: [],

    topics: [],
    tags: [],
    articles: [],

    topicSuggestions: [],
    tagSuggestions: [],
    articleSuggestions: [],

    selectedItemType: undefined,
    selectedItemId: undefined,
    cancelSelection: false,
    selectedFromMap: false,

    totalArticlePages: undefined,
    totalArticles: undefined,
    totalTagPages: undefined,
    totalTags: undefined,
    totalTopicPages: undefined,
    totalTopics: undefined,
    currentPage: 1,

    relatedTopics: [],
    relatedTags: [],
    relatedArticles: []
};

const _parseSearchResults = (searchState, action) => {
    searchState.isSearching = action.isSearching;
    searchState.hasSearched = true;

    searchState.query = action.query;

    searchState.selectedTypes = action.selectedTypes;
    searchState.searchParams = action.searchParams;

    searchState.topics = action.topics || [];
    searchState.tags = action.tags || [];
    searchState.articles = action.articles || [];

    searchState.hasResults = !(Utils.isEmpty(searchState.topics) && Utils.isEmpty(searchState) && Utils.isEmpty(searchState.articles));

    searchState.totalArticlePages = action.totalPages.articles;
    searchState.totalArticles = action.totalCount.articles;
    searchState.totalTagPages = action.totalPages.tags;
    searchState.totalTags = action.totalCount.tags;
    searchState.totalTopicPages = action.totalPages.topics;
    searchState.totalTopics = action.totalCount.topics;

    searchState.currentPage = parseInt(action.page || action.searchParams.page || 1, 10);

    if (action.suggestions) {
        searchState.topicSuggestions = action.suggestions.topics;
        searchState.tagSuggestions = action.suggestions.tags;
        searchState.articleSuggestions = action.suggestions.articles;
    }

    if (action.aggregations) {
        searchState.articleAvailableFilters = action.aggregations.articles;
    }

    if (action.searchFilters) {
        searchState.searchFilters = action.searchFilters;
    }

    if (action.selectedTags) {
        searchState.selectedTags = action.selectedTags;
    }

    if (action.meta && action.meta.metaTags) {
        searchState.metaTags = action.meta.metaTags;
    }

    return searchState;
};

export function searchReducer(state = searchState, action) {
    switch (action.type) {
        case ActionTypes.SEARCH_SEARCH_QUERY:
            state.query = action.query;
            return state;

        case ActionTypes.SEARCH_FETCH_INIT:
            state.isSearching = action.isSearching;
            return state;
        case ActionTypes.SEARCH_FETCH_ERROR:
            state.isSearching = false;
            state.hasResults = false;
            return state;
        case ActionTypes.SEARCH_FETCH_SUCCESS:
            return _parseSearchResults(state, action);

        case ActionTypes.SEARCH_TAG_SELECTED:
            state.selectedTags = addOrRemoveIn(state.selectedTags, action.tag);
            return state;

        // TOPIC
        case ActionTypes.TOPIC_CHANGE_SUCCESS:
            if(action.removedId) {
                removeIn(state.topics, action.removedId);
            } else {
                addOrReplaceIn(state.topics, action.topic);
            }
            return state;

        // TAG
        case ActionTypes.TAG_CHANGE_SUCCESS:
            if(action.removedId) {
                removeIn(state.tags, action.removedId);
            } else {
                addOrReplaceIn(state.tags, action.tag);
            }
            return state;

        // ARTICLE
        case ActionTypes.ARTICLE_CHANGE_SUCCESS:
            if(action.removedId) {
                removeIn(state.articles, action.removedId);
            } else {
                addOrReplaceIn(state.articles, action.article);
            }
            return state;

        default:
            return state;
    }
}
