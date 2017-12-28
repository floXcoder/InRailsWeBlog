'use strict';

import {
    createSelector
} from 'reselect';

export const getTags = createSelector(
    (state) => state.tagState.tags,
    (tags) => tags.toArray()
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
                    title: I18n.t('js.tag.enums.visibility.' + visibility),
                    items: tagsByVisibility[visibility]
                }
            );
        }

        return categorizedTags;
    }
);
