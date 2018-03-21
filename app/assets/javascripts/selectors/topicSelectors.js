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

// Topic
export const getTopic = createSelector(
    (state) => state.topicState.topic,
    (topic) => topic
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

export const getTopicErrors = createSelector(
    (state) => state.topicState.errors,
    (errors) => {
        let errorContent = [];
        if (typeof errors === 'string') {
            errorContent = [errors];
        } else {
            errors.mapKeys((errorName, errorDescriptions) => {
                errorDescriptions = errorDescriptions.toJS();
                errorContent.push(I18n.t(`js.topic.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
            }).toArray();
        }
        return errorContent;
    }
);
