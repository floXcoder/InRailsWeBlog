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
