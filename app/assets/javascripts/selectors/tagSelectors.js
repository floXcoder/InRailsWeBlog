'use strict';

import _ from 'lodash';

import Fuzzy from 'fuzzy';

import {
    createSelector
} from 'reselect';

export const getTags = createSelector(
    (state) => state.tagState.tags,
    (tags) => tags.toArray()
);

export const getTagMetaTags = createSelector(
    (state) => state.tagState.metaTags,
    (metaTags) => metaTags.toJS()
);

export const getTopicTags = createSelector(
    (state) => state.tagState.topicTags,
    (tags) => tags.toArray()
);

export const getPublicTags = createSelector(
    (state) => state.tagState.tags,
    (tags) => tags.filter((tag) => tag.visibility === 'everyone').toArray()
);

export const getPrivateTags = createSelector(
    (state) => state.tagState.tags,
    (tags) => tags.filter((tag) => tag.visibility === 'only_me').toArray()
);

export const getPopularTags = createSelector(
    (state) => state.tagState.popularTags,
    (tags) => tags.toArray()
);

export const getTag = createSelector(
    (state) => state.tagState.tag,
    (tag) => tag
);

export const getSortedTopicTags = createSelector(
    (state) => state.tagState.topicTags,
    (state) => state.userState.user && state.userState.user.settings.tagSidebarWithChild,
    (state) => state.userState.user && state.userState.user.settings.tagOrder,
    (state) => state.tagState.filterText,
    (tags, displayChildWithParent, tagOrder, filterText) => {
        tags = tags.toJS();

        if (tagOrder === 'priority') {
            tags = _.sortBy(tags, (t) => -t.priority);
        }

        return tags.map((tag) => {
            let parents = [];
            let children = [];

            if (!Utils.isEmpty(tag.parentIds)) {
                parents = tag.parentIds.map((parentId) => {
                    const parentTag = tags.find((tag) => tag.id === parentId);
                    if (!!parentTag && !Utils.isEmpty(filterText) && !Fuzzy.match(filterText, parentTag.name)) {
                        return null;
                    } else {
                        return parentTag && _.omit(parentTag, ['parentIds', 'childIds']);
                    }
                }).compact();
            }

            if (!Utils.isEmpty(tag.childIds)) {
                children = tag.childIds.map((childId) => {
                    const childTag = tags.find((tag) => tag.id === childId);
                    if (!!childTag && !Utils.isEmpty(filterText) && !Fuzzy.match(filterText, childTag.name)) {
                        return null;
                    } else {
                        return childTag && _.omit(childTag, ['parentIds', 'childIds']);
                    }
                }).compact();
            }

            // Will hide also tags which are both without parents and child type
            if (!displayChildWithParent) {
                if (tag.childOnly) {
                    return null;
                }
            }

            if (!Utils.isEmpty(filterText) && Utils.isEmpty(children) && !Fuzzy.match(filterText, tag.name)) {
                return null;
            }

            return _.merge(_.omit(tag, ['parentIds', 'childIds']), {parents: parents, children: children});
        }).compact();
    }
);

export const getCategorizedTags = createSelector(
    (state) => state.tagState.topicTags,
    (_, inheritVisibility) => inheritVisibility,
    (tags, inheritVisibility) => {
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
                if (tag.visibility === inheritVisibility) {
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

export const getCurrentTagSlugs = createSelector(
    (state) => state.tagState.currentTagSlugs,
    (tags) => tags.toArray().compact()
);

// export const getTagIsOwner = (state, tag) => (
//     tag && tag.user ? state.userState.currentId === tag.user.id : false
// );

export const getTagErrors = createSelector(
    (state) => state.tagState.errors,
    (errors) => {
        let errorContent = [];
        if (typeof errors === 'string') {
            errorContent = [errors];
        } else {
            errors.mapKeys((errorName, errorDescriptions) => {
                errorDescriptions = errorDescriptions.toJS();
                errorContent.push(I18n.t(`js.tag.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
            }).toArray();
        }
        return errorContent;
    }
);
