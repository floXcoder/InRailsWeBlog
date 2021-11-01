'use strict';

import Fuzzy from 'fuzzy';

import {
    createSelector
} from 'reselect';

export const getPublicTags = createSelector(
    (state) => state.tagState.tags,
    (tags) => tags.filter((tag) => tag.visibility === 'everyone')
);

export const getPrivateTags = createSelector(
    (state) => state.tagState.tags,
    (tags) => tags.filter((tag) => tag.visibility === 'only_me')
);

export const getHasTopicTags = createSelector(
    (state) => state.tagState.topicTags,
    (topicTags) => !!topicTags
);

export const getSortedTopicTags = createSelector(
    (state) => state.tagState.topicTags,
    (state) => state.userState.user?.settings?.tagSidebarWithChild,
    (state) => state.userState.user?.settings?.tagOrder,
    (state) => state.tagState.filterText,
    (tags, displayChildWithParent, tagOrder, filterText) => {
        if(!tags) {
            return [];
        }

        if (tagOrder === 'priority') {
            tags = tags.sort((t) => -t.priority);
        }

        return tags.map((tag) => {
            let parents = [];
            let children = [];

            if (Utils.isPresent(tag.parentIds)) {
                parents = tag.parentIds.map((parentId) => {
                    const parentTag = tags.find((tag) => tag.id === parentId);
                    if (!!parentTag && Utils.isPresent(filterText) && !Fuzzy.match(filterText, parentTag.name)) {
                        return null;
                    } else if (parentTag) {
                        const {parentIds, childIds, ...parentTagProps} = parentTag;
                        return parentTagProps;
                    }
                }).compact();
            }

            if (Utils.isPresent(tag.childIds)) {
                children = tag.childIds.map((childId) => {
                    const childTag = tags.find((tag) => tag.id === childId);
                    if (!!childTag && Utils.isPresent(filterText) && !Fuzzy.match(filterText, childTag.name)) {
                        return null;
                    } else if (childTag) {
                        const {parentIds, childIds, ...childTagProps} = childTag;
                        return childTagProps;
                    }
                }).compact();
            }

            // Will hide also tags which are both without parents and child type
            if (!displayChildWithParent) {
                if (tag.childOnly) {
                    return null;
                }
            }

            if (Utils.isPresent(filterText) && Utils.isEmpty(children) && !Fuzzy.match(filterText, tag.name)) {
                return null;
            }

            const {parentIds, childIds, ...tagProps} = tag;
            return {...tagProps, parents, children};
        }).compact();
    }
);

export const getCategorizedTags = createSelector(
    (state) => state.tagState.topicTags,
    (_, inheritVisibility) => inheritVisibility,
    (_, _visibility, childOnly) => childOnly,
    (tags, inheritVisibility, childOnly = false) => {
        let categorizedTags = [];

        if (tags) {
            // Define order in categorized box
            let tagsByVisibility = {
                // only_me: [],
                // everyone: []
            };

            if (inheritVisibility) {
                tagsByVisibility[inheritVisibility] = [];
            }

            tags.forEach((tag) => {
                if (tag.visibility === inheritVisibility && tag.childOnly === childOnly) {
                    if (!tagsByVisibility[tag.visibility]) {
                        tagsByVisibility[tag.visibility] = [tag.name];
                    } else {
                        tagsByVisibility[tag.visibility].push(tag.name);
                    }
                }
            });

            categorizedTags = Object.keys(tagsByVisibility).map((visibility) => ({
                id: visibility,
                type: ' ',
                title: I18n.t(`js.article.common.tags.${visibility}`),
                items: tagsByVisibility[visibility]
            }));
        }

        return categorizedTags;
    }
);

export const getAssociatedTopics = createSelector(
    (state) => state.topicState.userTopics,
    (state) => state.tagState.tag,
    (userTopics, tag) => {
        if (userTopics && tag) {
            return userTopics.filter((topic) => topic.tagIds?.includes(tag.id))
        } else {
            return undefined;
        }
    }
);

export const getCurrentTagSlugs = createSelector(
    (state) => state.tagState.currentTagSlugs,
    (tags) => tags?.compact()
);

// export const getTagIsOwner = (state, tag) => (
//     tag && tag.user ? state.userState.currentId === tag.user.id : false
// );

export const getTagErrors = createSelector(
    (state) => state.tagState.errors,
    (errors) => {
        let errorContent = undefined;
        if (typeof errors === 'string') {
            errorContent = [errors];
        } else if (Utils.isPresent(errors)) {
            errorContent = [];
            Object.entries(errors).forEach(([errorName, errorDescriptions]) => {
                if (Utils.isPresent(errorDescriptions)) {
                    errorContent.push(I18n.t(`js.tag.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
                }
            });
        }
        return errorContent;
    }
);
