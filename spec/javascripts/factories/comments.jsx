const { faker } = require('@faker-js/faker');

module.exports = (props = {}) => ({
    title: props.defined ? 'comment title' : faker.person.firstName(),
    subject: props.defined ? 'comment subject' : faker.lorem.words(5),
    body: props.defined ? 'comment body' : faker.lorem.paragraphs(4),
    rating: props.defined ? 4 : Math.random() * 5 | 0,
    parentId: props.defined ? 1 : Math.random() * 3 | 1,
    nestedLevel: props.defined ? 1 : Math.random() * 3 | 1,
    postedAt: props.defined ? '2017-05-05' : faker.date.past().toDateString(),
    accepted: true,
    askForDeletion: false,
    commentableType: 'article',
    link: `/comments/${props.id}`,

    user: {belongsTo: 'users'},
    commentable: {belongsTo: 'articles'}
});
