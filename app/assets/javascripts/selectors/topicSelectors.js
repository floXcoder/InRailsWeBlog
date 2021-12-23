'use strict';

import {
    createSelector
} from 'reselect';

// Topics
export const getPublicTopics = createSelector(
    (state) => state.topicState.userTopics,
    (topics) => topics.filter((topic) => topic.visibility === 'everyone').sort((a, b) => b.priority - a.priority)
);

export const getPrivateTopics = createSelector(
    (state) => state.topicState.userTopics,
    (topics) => topics.filter((topic) => topic.visibility === 'only_me').sort((a, b) => b.priority - a.priority)
);

// Topic
export const getEditingTopic = createSelector(
    (state) => state.topicState.userTopics,
    (_, routerSearch) => routerSearch?.topicId,
    (topics, topicId) => topics.find((topic) => topic.id === topicId)
);

export const getSharingTopic = createSelector(
    (state) => state.topicState.userTopics,
    (_, routerSearch) => routerSearch?.topicId,
    (topics, topicId) => topics.find((topic) => topic.id === topicId)
);

// Current topic of user
export const getCurrentUserTopicVisibility = createSelector(
    (state) => state.topicState.currentTopic,
    (topic) => topic?.visibility
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
            currentTopicSlug = params.articleSlug.match(/@.*?$/)?.first()?.substr(1);
        }

        return userTopics.some((topic) => topic.slug === currentTopicSlug);
    }
);

export const getTopicErrors = createSelector(
    (state) => state.topicState.errors,
    (errors) => {
        let errorContent;
        if (typeof errors === 'string') {
            errorContent = [errors];
        } else if (Utils.isPresent(errors)) {
            errorContent = [];
            Object.entries(errors).forEach(([errorName, errorDescriptions]) => {
                if (Utils.isPresent(errorDescriptions)) {
                    errorContent.push(I18n.t(`js.topic.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
                }
            });
        }
        return errorContent;
    }
);
