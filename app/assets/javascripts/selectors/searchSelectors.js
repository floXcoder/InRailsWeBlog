'use strict';

import _ from 'lodash';

import {
    createSelector
} from 'reselect';

// Autocompletes
export const getAutocompleteTopics = createSelector(
    (state) => state.autocompleteState.topics,
    (topics) => topics.toArray()
);
export const getAutocompleteTags = createSelector(
    (state) => state.autocompleteState.tags,
    (tags) => tags.toArray()
);
export const getAutocompleteArticles = createSelector(
    (state) => state.autocompleteState.articles,
    (articles) => articles.toArray()
);
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

export const getAutocompleteSelectedTags = createSelector(
    (state) => state.autocompleteState.selectedTags,
    (tags) => tags.toArray()
);

// Results
export const getSearchArticles = createSelector(
    (state) => state.searchState.articles,
    (articles) => articles.toArray()
);

export const getSearchTags = createSelector(
    (state) => state.searchState.tags,
    (tags) => tags.toArray()
);

export const getSearchTopics = createSelector(
    (state) => state.searchState.topics,
    (topics) => topics.toArray()
);

export const getSearchMetaTags = createSelector(
    (state) => state.searchState.metaTags,
    (metaTags) => metaTags.toJS()
);

export const getSelectedTags = createSelector(
    (state) => state.searchState.selectedTags,
    (tags) => tags.toArray()
);

// Suggestions
export const getArticleSuggestions = createSelector(
    (state) => state.searchState.articleSuggestions,
    (articleSuggestions) => articleSuggestions && articleSuggestions.toJS()
);

export const getTagSuggestions = createSelector(
    (state) => state.searchState.tagSuggestions,
    (tagSuggestions) => tagSuggestions && tagSuggestions.toJS()
);

// Filters / Aggregations
export const getSearchFilters = createSelector(
    (state) => state.searchState.searchFilters,
    (searchFilters) => searchFilters && searchFilters.toJS()
);

export const getArticleAvailableFilters = createSelector(
    (state) => state.searchState.articleAvailableFilters,
    (articleAvailableFilters) => articleAvailableFilters && articleAvailableFilters.toJS()
);
