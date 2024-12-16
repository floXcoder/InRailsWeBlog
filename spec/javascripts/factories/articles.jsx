const { faker } = require('@faker-js/faker');

module.exports = (props = {}) => ({
    mode: 'story',
    modeTranslated: 'Article',
    title: props.defined ? 'article title' : faker.lorem.words(4),
    summary: props.defined ? 'article summary' : faker.lorem.words(6),
    content: props.defined ? 'article body' : faker.lorem.paragraphs(4),
    highlightContent: 'article <span>highlight</span>',
    references: props.defined ? 'http://reference.url' : faker.internet.url(),
    date: props.defined ? '2017-05-05' : faker.date.past().toDateString(),
    dateShort: props.defined ? '05/05' : faker.date.past().toDateString(),
    allowComment: true,
    draft: false,
    languages: ['en'],
    visibility: 'everyone',
    visibilityTranslated: 'Public',
    slug: `/users/${props.id}/articles/${props.id}`,
    bookmarked: false,
    outdated: false,
    picturesCount: props.defined ? 4 : Math.random() * 10 | 0,
    bookmarksCount: props.defined ? 2 : Math.random() * 10 | 0,
    commentsCount: props.defined ? 3 : Math.random() * 20 | 0,
    outdatedCount: props.defined ? 0 : Math.random() * 10 | 0,

    user: {belongsTo: 'users'},
    topic: {belongsTo: 'topics'},
    tags: {hasMany: 'tags', number: 2},
    parentTagIds: [1],
    childTagIds: [2]
});
