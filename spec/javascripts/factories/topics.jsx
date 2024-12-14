const { faker } = require('@faker-js/faker');

module.exports = (props = {}) => ({
    userId: 1,
    name: props.defined ? 'topic name' : faker.lorem.words(),
    description: props.defined ? 'topic description' : faker.lorem.words(),
    date: props.defined ? '2017-05-05' : faker.date.past().toDateString(),
    priority: props.defined ? 0 : Math.random() * 10 | 0,
    visibility: 'everyone',
    visibilityTranslated: 'Public',
    slug: `/topic/${props.id}`,
    viewsCount: props.defined ? 5 : Math.random() * 10 | 0,
    clicksCount: props.defined ? 5 : Math.random() * 10 | 0,
    searchesCount: props.defined ? 5 : Math.random() * 10 | 0
});
