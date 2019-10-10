'use strict';

import {
    createSelector
} from 'reselect';

// Meta search
export const getMetaResults = createSelector(
    (state) => state.adminState.metaResults,
    (metaResults) => {
        let results = [];

        Object.entries(metaResults.toJS()).forEach(([model, values]) => {
            values.map((value) => {
                if(model === 'articles') {
                    results.push({
                        model: 'article',
                        id: value.id,
                        value: value.title,
                        link: value.link
                    });
                } else if (model === 'tags') {
                    results.push({
                        model: 'tag',
                        id: value.id,
                        value: value.name,
                        link: value.link
                    });
                } else if (model === 'topics') {
                    results.push({
                        model: 'topic',
                        id: value.id,
                        value: value.name,
                        link: value.link
                    });
                } else if (model === 'users') {
                    results.push({
                        model: 'user',
                        id: value.id,
                        value: value.email,
                        link: value.link
                    });
                }
            })
        });

        return results;
    }
);

// Blogs
export const getBlogs = createSelector(
    (state) => state.adminState.blogs,
    (blogs) => blogs.toArray()
);
