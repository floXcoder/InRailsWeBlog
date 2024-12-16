import {
    createSelector
} from 'reselect';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

const fuzzyMatch = function (pattern, str, opts) {
    opts = opts || {};
    let patternIdx = 0;
    const result = [];
    const len = str.length;
    let totalScore = 0;
    let currScore = 0;
    // prefix
    const pre = opts.pre || '';
    // suffix
    const post = opts.post || '';
    // String to compare against. This might be a lowercase version of the
    // raw string
    const compareString = (opts.caseSensitive && str) || str.toLowerCase();
    let ch;

    pattern = (opts.caseSensitive && pattern) || pattern.toLowerCase();

    // For each character in the string, either add it to the result
    // or wrap in template if it's the next string in the pattern
    for (var idx = 0; idx < len; idx++) {
        ch = str[idx];
        if (compareString[idx] === pattern[patternIdx]) {
            ch = pre + ch + post;
            patternIdx += 1;

            // consecutive characters should increase the score more than linearly
            currScore += 1 + currScore;
        } else {
            currScore = 0;
        }
        totalScore += currScore;
        result[result.length] = ch;
    }

    // return rendered string if we have a match for every char
    if (patternIdx === pattern.length) {
        // if the string is an exact match with pattern, totalScore should be maxed
        totalScore = (compareString === pattern) ? Infinity : totalScore;
        return {
            rendered: result.join(''),
            score: totalScore
        };
    }

    return null;
};


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
        if (!tags) {
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
                    const parentTag = tags.find((newTag) => newTag.id === parentId);
                    if (!!parentTag && Utils.isPresent(filterText) && !fuzzyMatch(filterText, parentTag.name)) {
                        return null;
                    } else if (parentTag) {
                        const {
                            parentIds,
                            childIds,
                            ...parentTagProps
                        } = parentTag;
                        return parentTagProps;
                    } else {
                        return undefined;
                    }
                })
                    .compact();
            }

            if (Utils.isPresent(tag.childIds)) {
                children = tag.childIds.map((childId) => {
                    const childTag = tags.find((newTag) => newTag.id === childId);
                    if (!!childTag && Utils.isPresent(filterText) && !fuzzyMatch(filterText, childTag.name)) {
                        return null;
                    } else if (childTag) {
                        const {
                            parentIds,
                            childIds,
                            ...childTagProps
                        } = childTag;
                        return childTagProps;
                    } else {
                        return undefined;
                    }
                })
                    .compact();
            }

            // Will hide also tags which are both without parents and child type
            if (!displayChildWithParent) {
                if (tag.childOnly) {
                    return null;
                }
            }

            if (Utils.isPresent(filterText) && Utils.isEmpty(children) && !fuzzyMatch(filterText, tag.name)) {
                return null;
            }

            const {
                parentIds,
                childIds,
                ...tagProps
            } = tag;
            return {
                ...tagProps,
                parents,
                children
            };
        })
            .compact();
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
            const tagsByVisibility = {
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

            categorizedTags = Object.keys(tagsByVisibility)
                .map((visibility) => ({
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
            return userTopics.filter((topic) => topic.tagIds?.includes(tag.id));
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
        let errorContent;
        if (typeof errors === 'string') {
            errorContent = [errors];
        } else if (Utils.isPresent(errors)) {
            errorContent = [];
            Object.entries(errors)
                .forEach(([errorName, errorDescriptions]) => {
                    if (Utils.isPresent(errorDescriptions)) {
                        errorContent.push(I18n.t(`js.tag.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
                    }
                });
        }
        return errorContent;
    }
);
