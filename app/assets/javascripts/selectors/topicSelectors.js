'use strict';

import {
    createSelector
} from 'reselect';

// Topics
export const getTopics = createSelector(
    (state) => state.topicState.topics,
    (topics) => topics.toArray()
);

export const getTopicPagination = createSelector(
    (state) => state.topicState.pagination,
    (pagination) => pagination.toJS()
);
