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

// Current topic
export const getCurrentTopic = createSelector(
    (state) => state.topicState.currentTopic,
    (topic) => topic
);

export const getCurrentTopicVisibility = createSelector(
    (state) => state.topicState.currentTopic,
    (topic) => topic && topic.visibility
);
