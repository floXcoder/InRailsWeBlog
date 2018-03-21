'use strict';

import {
    Record,
    Map,
    List
} from 'immutable';

export const SettingsRecord = new Record({
    articlesLoader: 'infinite',
    articleDisplay: 'card',
    articleOrder: undefined,
    tagSidebarPin: false,
    tagSidebarWithChild: false,
    searchHighlight: true,
    searchOperator: 'or',
    searchExact: false
});

export class UserRecord extends Record({
    id: undefined,
    pseudo: undefined,
    email: undefined,
    firstName: undefined,
    lastName: undefined,
    city: undefined,
    country: undefined,
    additionalInfo: undefined,
    locale: undefined,
    date: undefined,
    avatarUrl: undefined,
    slug: undefined,
    signInCount: undefined,
    lastSignInAt: undefined,
    articlesCount: undefined,
    tracker: undefined,
    settings: new SettingsRecord()
}) {
    constructor({settings, ...props} = {}) {
        super({
            ...props,
            settings: new SettingsRecord(settings)
        })
    }
}

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
    date: undefined,
    priority: undefined,
    visibility: undefined,
    visibilityTranslated: undefined,
    slug: undefined,
    viewsCount: undefined,
    clicksCount: undefined,
    searchesCount: undefined,
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
    date: undefined,
    priority: undefined,
    visibility: undefined,
    visibilityTranslated: undefined,
    taggedArticlesCount: undefined,
    parentIds: undefined,
    parents: List(),
    childIds: undefined,
    children: List(),
    slug: undefined,
    viewsCount: undefined,
    clicksCount: undefined,
    searchesCount: undefined,
    user: new UserRecord()
}) {
    constructor({user, parents, children, ...props} = {}) {
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
    mode: undefined,
    modeTranslated: undefined,
    topicId: undefined,
    title: undefined,
    summary: undefined,
    content: undefined,
    highlightContent: undefined,
    reference: undefined,
    date: undefined,
    dateShort: undefined,
    allowComment: undefined,
    draft: undefined,
    currentLanguage: undefined,
    languages: undefined,
    visibility: undefined,
    visibilityTranslated: undefined,
    slug: undefined,
    bookmarked: false,
    outdated: false,
    votesUp: undefined,
    votesDown: undefined,
    picturesCount: undefined,
    bookmarksCount: undefined,
    commentsCount: undefined,
    outdatedCount: undefined,
    user: new UserRecord(),
    tags: List(),
    parentTagIds: List(),
    childTagIds: List(),
    newTagIds: List()
}) {
    constructor({user, tags, ...props} = {}) {
        super({
            ...props,
            user: new UserRecord(user),
            tags: List(tags).map(tag => new TagRecord(tag))
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


