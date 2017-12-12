'use strict';

import {
    Record,
    Map,
    List
} from 'immutable';

export const UserRecord = new Record({
    id: undefined,
    pseudo: undefined,
    email: undefined,
    firstName: undefined,
    lastName: undefined,
    city: undefined,
    country: undefined,
    additionalInfo: undefined,
    locale: undefined,
    createdAt: undefined,
    avatarUrl: undefined,
    slug: undefined,
    signInCount: undefined,
    lastSignInAt: undefined,
    articlesCount: undefined,
    tracker: undefined
});

export const SettingRecord = new Record({
    articleDisplay: undefined,
    searchHighlight: undefined,
    searchOperator: undefined,
    searchExact: undefined
});

export const PictureRecord = new Record({
    id: undefined,
    description: undefined,
    copyright: undefined,
    url: undefined,
    mediumUrl: undefined,
    miniUrl: undefined,
    filename: undefined,
    dimension: undefined
});

export class TopicRecord extends Record({
    id: undefined,
    userId: undefined,
    name: undefined,
    description: undefined,
    priority: undefined,
    visibility: undefined,
    slug: undefined,
    tags: List()
}) {
    constructor({tags, ...props} = {}) {
        super({
            ...props,
            tags: List(tags).map(tag => new TagRecord(tag))
        })
    }
}

export class TagRecord extends Record({
    id: undefined,
    name: undefined,
    description: undefined,
    synonyms: List(),
    priority: undefined,
    visibility: undefined,
    visibilityTranslated: undefined,
    taggedArticlesCount: undefined,
    parents: undefined,
    children: undefined,
    slug: undefined,
    user: new UserRecord()
}) {
    constructor({parents, children, user, ...props} = {}) {
        super({
            ...props,
            user: new UserRecord(user),
            parents: List(parents).map(tag => new TagRecord(tag)),
            children: List(children).map(tag => new TagRecord(tag))
        })
    }
}

export class ArticleRecord extends Record({
    id: undefined,
    topicId: undefined,
    title: undefined,
    summary: undefined,
    content: undefined,
    highlightContent: undefined,
    reference: undefined,
    updatedAt: undefined,
    allowComment: undefined,
    visibility: undefined,
    visibilityTranslated: undefined,
    draft: undefined,
    slug: undefined,
    outdatedNumber: undefined,
    commentsNumber: undefined,
    user: new UserRecord(),
    tags: List(),
    parentTags: List(),
    childTags: List(),
    newTags: List()
}) {
    constructor({user, tags, parentTags, childTags, newTags, ...props} = {}) {
        super({
            ...props,
            user: new UserRecord(user),
            tags: List(tags).map(tag => new TagRecord(tag)),
            parentTags: List(parentTags).map(tag => new TagRecord(tag)),
            childTags: List(childTags).map(tag => new TagRecord(tag)),
            newTags: List(newTags).map(tag => new TagRecord(tag))
        })
    }
}

export class HistoryRecord extends Record({
    id: undefined,
    changedAt: undefined,
    article: undefined,
    changeset: undefined
}) {
    constructor({article, ...props} = {}) {
        super({
            ...props,
            article: new ArticleRecord(article)
        })
    }
}

export class CommentRecord extends Record({
    id: undefined,
    title: undefined,
    body: undefined,
    subject: undefined,
    rating: undefined,
    parentId: undefined,
    nestedLevel: undefined,
    postedAt: undefined,
    accepted: undefined,
    askForDeletion: undefined,
    commentableType: undefined,
    link: undefined,
    user: new UserRecord(),
    commentable: Map()
}) {
    constructor({user, commentable, ...props} = {}) {
        if (props.commentableType === 'Article') {
            commentable = new ArticleRecord(commentable);
        }

        super({
            ...props,
            user: new UserRecord(user),
            commentable
        })
    }
}


