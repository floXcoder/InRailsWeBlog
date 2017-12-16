'use strict';

import {
    createSelector
} from 'reselect';

export const getTags = createSelector(
    (state) => state.tagState.tags,
    (tags) => tags.toArray()
);
