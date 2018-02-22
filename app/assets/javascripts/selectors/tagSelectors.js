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

export const getPublicTags = createSelector(
    (state) => state.tagState.tags,
    (tags) => tags.filter((tag) => tag.visibility === 'everyone').toArray()
);

export const getPrivateTags = createSelector(
    (state) => state.tagState.tags,
    (tags) => tags.filter((tag) => tag.visibility === 'only_me').toArray()
);

export const getSortedTags = createSelector(
    (state) => state.tagState.tags,
    (state) => state.userState.user && state.userState.user.settings.tagSidebarWithChild,
    (state) => state.tagState.filterText,
    (tags, displayChildWithParent, filterText) => (
        tags.toJS().map((tag) => {
            let parents = [];
            let children = [];

            if (!Utils.isEmpty(tag.parentIds)) {
                parents = tag.parentIds.map((parentId) => {
                    const parentTag = tags.find((tag) => tag.id === parentId);
                    if (!!parentTag && !Utils.isEmpty(filterText) && !Fuzzy.match(filterText, parentTag.name)) {
                        return null;
                    } else {
                        return parentTag && _.omit(parentTag.toJS(), ['parentIds', 'childIds']);
                    }
                }).compact();
            }

            if (!Utils.isEmpty(tag.childIds)) {
                children = tag.childIds.map((childId) => {
                    const childTag = tags.find((tag) => tag.id === childId);
                    if (!!childTag && !Utils.isEmpty(filterText) && !Fuzzy.match(filterText, childTag.name)) {
                        return null;
                    } else {
                        return childTag && _.omit(childTag.toJS(), ['parentIds', 'childIds']);
                    }
                }).compact();
            }

            // Will hide also tags which are both without parents and child type
            if (!displayChildWithParent) {
                if (parents.length > 0 && children.length === 0) {
                    return null;
                }
            }

            if (!Utils.isEmpty(filterText) && Utils.isEmpty(children) && !Fuzzy.match(filterText, tag.name)) {
                return null;
            }

            return _.merge(_.omit(tag, ['parentIds', 'childIds']), {parents: parents, children: children});
        }).compact()
    )
);

export const getCategorizedTags = createSelector(
    getTags,
    (tags) => {
        let categorizedTags = [];

        if (tags) {
            // Define order in categorized box
            let tagsByVisibility = {
                only_me: [],
                everyone: [],
            };

            tags.forEach((tag) => {
                if (!tagsByVisibility[tag.visibility]) {
                    tagsByVisibility[tag.visibility] = [tag.name];
                } else {
                    tagsByVisibility[tag.visibility].push(tag.name);
                }
            });

            categorizedTags = Object.keys(tagsByVisibility).map((visibility) => (
                {
                    id: visibility,
                    type: ' ',
                    title: I18n.t(`js.tag.enums.visibility.${visibility}`),
                    items: tagsByVisibility[visibility]
                }
            ))
        }

        return categorizedTags;
    }
);

export const getTagIsOwner = (state, tag) => (
    tag && tag.user ? state.userState.currentId === tag.user.id : false
);

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
