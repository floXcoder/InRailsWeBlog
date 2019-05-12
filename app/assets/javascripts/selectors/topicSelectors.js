'use strict';

import {
    createSelector
} from 'reselect';

// Topics
export const getTopics = createSelector(
    (state) => state.topicState.topics,
    (topics) => topics.toArray()
);

export const getTopicMetaTags = createSelector(
    (state) => state.topicState.metaTags,
    (metaTags) => metaTags.toJS()
);

export const getTopicPagination = createSelector(
    (state) => state.topicState.pagination,
    (pagination) => pagination.toJS()
);

export const getUserTopics = createSelector(
    (state) => state.topicState.userTopics,
    (topics) => topics.toArray()
);

export const getContributedTopics = createSelector(
    (state) => state.topicState.contributedTopics,
    (topics) => topics.toArray()
);

export const getPublicTopics = createSelector(
    (state) => state.topicState.userTopics,
    (topics) => topics.filter((topic) => topic.visibility === 'everyone').sort((a, b) => b.priority - a.priority).toArray()
);

export const getPrivateTopics = createSelector(
    (state) => state.topicState.userTopics,
    (topics) => topics.filter((topic) => topic.visibility === 'only_me').sort((a, b) => b.priority - a.priority).toArray()
);

// Topic
export const getTopic = createSelector(
    (state) => state.topicState.topic,
    (topic) => topic
);

export const getEditingTopic = createSelector(
    (state) => state.topicState.userTopics,
    (_, routerState) => routerState && routerState.topicId,
    (topics, topicId) => topics.find((topic) => topic.id === topicId)
);

export const getSharingTopic = createSelector(
    (state) => state.topicState.userTopics,
    (_, routerState) => routerState && routerState.topicId,
    (topics, topicId) => topics.find((topic) => topic.id === topicId)
);

// Current topic of user
export const getCurrentUserTopic = createSelector(
    (state) => state.topicState.currentTopic,
    (topic) => topic
);

export const getCurrentUserTopicVisibility = createSelector(
    (state) => state.topicState.currentTopic,
    (topic) => topic && topic.visibility
);

export const getIsCurrentTopicOwner = createSelector(
    (state) => state.topicState.userTopics,
    (_, params) => params,
    (userTopics, params) => {
        if (!userTopics) {
            return false;
        }

        let currentTopicSlug = params.topicSlug;

        // Extract topicSlug from article if any
        if (params.articleSlug) {
            currentTopicSlug = params.articleSlug.match(/@.*?$/).first().substr(1);
        }

        return userTopics.some((topic) => topic.slug === currentTopicSlug);
    }
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
