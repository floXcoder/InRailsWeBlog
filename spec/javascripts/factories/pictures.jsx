'use strict';

import faker from 'faker';

module.exports = (props = {}) => ({
    description: props.defined ? 'picture description' : faker.lorem.paragraphs(2),
    copyright: props.defined ? 'picture copyright' : faker.lorem.words(8),
    url: props.defined ? '/assets/pictures/picture.png' : faker.image.image(),
    mediumUrl: props.defined ? '/assets/pictures/medium_picture.png' : faker.image.image(),
    miniUrl: props.defined ? '/assets/pictures/mini_picture.png' : faker.image.image(),
    filename: props.defined ? 'picture.png' : faker.lorem.words(1),
    size: [400, 400],

    user: {belongsTo: 'users'}
});
