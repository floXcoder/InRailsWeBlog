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

export const getClassifiedTags = createSelector(
    (state) => state.tagState.tags,
    (state) => state.tagState.filterText,
    (tags, filterText) => (
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

            if (!Utils.isEmpty(filterText) && Utils.isEmpty(children) && !Fuzzy.match(filterText, tag.name)) {
                return null;
            }

            return _.merge(_.omit(tag, ['parentIds', 'childIds']), {parents: parents, children: children});
        })
    )
);

export const getCategorizedTags = createSelector(
    getTags,
    (tags) => {
        let categorizedTags = [];

        if (tags) {
            let tagsByVisibility = {};
            tags.forEach((tag) => {
                if (!tagsByVisibility[tag.visibility]) {
                    tagsByVisibility[tag.visibility] = [tag.name];
                } else {
                    tagsByVisibility[tag.visibility].push(tag.name);
                }
            });

            if (!tagsByVisibility.everyone) {
                tagsByVisibility.everyone = [];
            }
            if (!tagsByVisibility.only_me) {
                tagsByVisibility.only_me = [];
            }

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
