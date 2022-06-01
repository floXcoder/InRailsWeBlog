'use strict';

const { faker } = require('@faker-js/faker');

module.exports = (props = {}) => ({
    name: props.defined ? 'tag name' : faker.lorem.words(),
    description: props.defined ? 'tag description' : faker.lorem.words(),
    synonyms: props.defined ? ['other name'] : [faker.lorem.words(1)],
    date: props.defined ? '2017-05-05' : faker.date.past().toDateString(),
    priority: props.defined ? 0 : Math.random() * 10 | 0,
    visibility: 'everyone',
    visibilityTranslated: 'Public',
    taggedArticlesCount: props.defined ? 3 : Math.random() * 10 | 0,
    slug: `/tags/${props.id}`,
    viewsCount: props.defined ? 5 : Math.random() * 10 | 0,
    clicksCount: props.defined ? 5 : Math.random() * 10 | 0,
    searchesCount: props.defined ? 5 : Math.random() * 10 | 0,

    parentIds: [1],
    childIds: [2],

    user: {belongsTo: 'users'},
    // parents: {hasMany: 'tags', number: 2},
    // children: {hasMany: 'tags', number: 2}
});
