'use strict';

import {
    schema
} from 'normalizr';

const tag = new schema.Entity('tags');

const topic = new schema.Entity('topics', {
    tags: [tag]
});

const user = new schema.Entity('users', {
    currentTopic: topic,
    topics: [topic],
    tags: [tag]
});

const article = new schema.Entity('articles', {
    user,
    tags: [tag],
    parentTags: [tag],
    childTags: [tag]
});

export const userSchema = user;
export const topicSchema = topic;
export const articleSchema = article;
export const tagSchema = tag;
