import * as Utils from '@js/modules/utils';

import * as ActionTypes from '@js/constants/actionTypes';

import {
    fetchReducer,
    findItemIndex,
    addOrRemoveIn,
    removeIn,
    addOrReplaceIn
} from '@js/reducers/mutators';

// Autocomplete
const autocompleteState = {
    // Required for fetchReducer/mutationReducer
    isFetching: false,
    pagination: {},
    errors: {},

    query: '',

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
            state.isFetching = true;
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
                const sortedArticles = [...state.articles].sort((article) => article.topicId === action.currentTopicId).sort((article) => article.userId === action.currentUserId);
                if (!state.highlightedTag && !state.highlightedArticle) {
                    if (sortedArticles.last()) {
                        newArticle = sortedArticles.last();
                    } else if (state.tags.first()) {
                        newTag = state.tags.last();
                    }
                } else if (state.tags.first() && state.highlightedTag && state.highlightedTag.id === state.tags.first().id) {
                    newArticle = sortedArticles.last();
                    newTag = undefined;
                } else if (state.highlightedTag) {
                    newTag = state.tags[findItemIndex(state.tags, state.highlightedTag.id) - 1];
                } else if (state.highlightedArticle && state.highlightedArticle.id === sortedArticles.first().id) {
                    newArticle = sortedArticles.first();
                    newTag = undefined;
                } else if (state.highlightedArticle) {
                    newArticle = sortedArticles[findItemIndex(sortedArticles, state.highlightedArticle.id) - 1];
                }

                state.highlightedTag = newTag;
                state.highlightedArticle = newArticle;
            } else if (action.keyCode === 'ArrowDown') {
                const sortedArticles = [...state.articles].sort((article) => article.topicId === action.currentTopicId).sort((article) => article.userId === action.currentUserId);
                if (!state.highlightedTag && !state.highlightedArticle) {
                    if (state.tags.first()) {
                        newTag = state.tags.first();
                    } else if (sortedArticles.first()) {
                        newArticle = sortedArticles.first();
                    }
                } else if (state.tags.last() && state.highlightedTag && state.highlightedTag.id === state.tags.last().id) {
                    newArticle = sortedArticles.first();
                    newTag = undefined;
                } else if (state.highlightedTag) {
                    newTag = state.tags[findItemIndex(state.tags, state.highlightedTag.id) + 1];
                } else if (sortedArticles.last() && state.highlightedArticle && state.highlightedArticle.id === sortedArticles.last().id) {
                    if (state.tags.first()) {
                        newTag = state.tags.first();
                        newArticle = undefined;
                    } else {
                        newTag = undefined;
                        newArticle = sortedArticles.first();
                    }
                } else if (state.highlightedArticle) {
                    newArticle = sortedArticles[findItemIndex(sortedArticles, state.highlightedArticle.id) + 1];
                }

                state.highlightedTag = newTag;
                state.highlightedArticle = newArticle;
            } else if (action.keyCode === 'Tab') {
                state.query = '';
                state.selectedTags = addOrRemoveIn(state.selectedTags, state.tags[findItemIndex(state.tags, state.highlightedTag ? state.highlightedTag.id : state.tags.first().id)]).compact();
                state.topics = [];
                state.tags = [];
                state.articles = [];
                state.highlightedTag = undefined;
                state.highlightedArticle = undefined;
            } else if (action.keyCode === 'Enter') {
                if (state.highlightedTag) {
                    state.query = '';
                    state.selectedTags = addOrRemoveIn(state.selectedTags, state.tags[findItemIndex(state.tags, state.highlightedTag.id)]).compact();
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
                state.selectedTags = state.tags?.length > 0 ? addOrRemoveIn(state.selectedTags, state.tags.last()).compact() : state.tags;
                state.topics = [];
                state.tags = [];
                state.articles = [];
                state.highlightedTag = undefined;
                state.highlightedArticle = undefined;
            }
            return state;

        case ActionTypes.SEARCH_AUTOCOMPLETE_TAG_SELECTED:
            state.selectedTags = action.tag ? addOrRemoveIn(state.selectedTags, action.tag).compact() : [];
            state.query = '';
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

    selectedTags: [],

    topics: [],
    tags: [],
    articles: [],

    topicSuggestions: [],
    tagSuggestions: [],
    articleSuggestions: [],

    currentPage: 1,

    // totalArticlePages: undefined,
    // totalArticles: undefined,
    // totalTagPages: undefined,
    // totalTags: undefined,
    // totalTopicPages: undefined,
    // totalTopics: undefined,

    relatedTopics: [],
    relatedTags: [],
    relatedArticles: [],

    scrapQuery: undefined
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

    searchState.hasResults = !(Utils.isEmpty(searchState.topics) && Utils.isEmpty(searchState.tags) && Utils.isEmpty(searchState.articles));

    searchState.currentPage = parseInt(action.page || action.searchParams.page || 1, 10);

    // searchState.totalArticlePages = action.totalPages.articles;
    // searchState.totalArticles = action.totalCount.articles;
    // searchState.totalTagPages = action.totalPages.tags;
    // searchState.totalTags = action.totalCount.tags;
    // searchState.totalTopicPages = action.totalPages.topics;
    // searchState.totalTopics = action.totalCount.topics;

    searchState.topicSuggestions = action.suggestions?.topics || [];
    searchState.tagSuggestions = action.suggestions?.tags || [];
    searchState.articleSuggestions = action.suggestions?.articles || [];

    searchState.articleAvailableFilters = action.aggregations?.articles || [];

    searchState.searchFilters = action.searchFilters || {};

    searchState.selectedTags = action.selectedTags || [];

    searchState.scrapQuery = action.scrapQuery;

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
            state.selectedTags = addOrRemoveIn(state.selectedTags, action.tag).compact();
            return state;

        case ActionTypes.SEARCH_URL_SCRAP:
            state.articles = state.articles.map((article) => {
                if (action.articleResults[article.id]) {
                    article.scrapResults = action.articleResults[article.id];
                    return article;
                } else {
                    return article;
                }
            });
            return state;

        // TOPIC
        case ActionTypes.TOPIC_CHANGE_SUCCESS:
            if (action.removedId) {
                removeIn(state.topics, action.removedId);
            } else {
                addOrReplaceIn(state.topics, action.topic);
            }
            return state;

        // TAG
        case ActionTypes.TAG_CHANGE_SUCCESS:
            if (action.removedId) {
                removeIn(state.tags, action.removedId);
            } else {
                addOrReplaceIn(state.tags, action.tag);
            }
            return state;

        // ARTICLE
        case ActionTypes.ARTICLE_CHANGE_SUCCESS:
            if (action.removedId) {
                removeIn(state.articles, action.removedId);
            } else {
                addOrReplaceIn(state.articles, action.article);
            }
            return state;

        default:
            return state;
    }
}
