'use strict';

import _ from 'lodash';

import {
    createSelector
} from 'reselect';

// Autocompletes
export const getAutocompleteResults = createSelector(
    (state) => state.autocompleteState.topics,
    (state) => state.autocompleteState.tags,
    (state) => state.autocompleteState.articles,
    (topics, tags, articles) => {
        let autocompletionValues = [];
        let tagValues = [];

        articles.map((autocompleteValue) => {
            autocompletionValues.push({entry: autocompleteValue.title, title: autocompleteValue.title});
            autocompleteValue.tags.forEach((tag) => {
                tagValues.push(tag.name);
            });
        });
        _.uniq(tagValues, (tag) => tag.id).forEach((tag) => {
            autocompletionValues.push({entry: tag, tag: tag});
        });

        return autocompletionValues;
    }
);

// Suggestions
export const getArticleSuggestions = createSelector(
    (state) => state.searchState.articleSuggestions,
    (articleSuggestions) => articleSuggestions && articleSuggestions
);

export const getTagSuggestions = createSelector(
    (state) => state.searchState.tagSuggestions,
    (tagSuggestions) => tagSuggestions && tagSuggestions
);

// Filters / Aggregations
export const getSearchFilters = createSelector(
    (state) => state.searchState.searchFilters,
    (searchFilters) => searchFilters && searchFilters
);

export const getArticleAvailableFilters = createSelector(
    (state) => state.searchState.articleAvailableFilters,
    (articleAvailableFilters) => articleAvailableFilters
);
