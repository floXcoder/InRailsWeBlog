'use strict';

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
        tagValues.forEach((tag) => {
            autocompletionValues.push({entry: tag, tag: tag});
        });

        return autocompletionValues;
    }
);
