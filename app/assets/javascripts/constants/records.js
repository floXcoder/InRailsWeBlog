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
    tagParentAndChild: false,
    tagSidebarPin: false,
    tagSidebarWithChild: false,
    tagOrder: undefined,
    searchDisplay: 'card',
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
    settings: new SettingsRecord(),
    topics: List(),
    contributedTopics: List()
}) {
    constructor({settings, topics, contributedTopics, ...props} = {}) {
        super({
            ...props,
            settings: new SettingsRecord(settings),
            topics: List(topics).map((topic) => new TopicRecord(topic)),
            contributedTopics: List(contributedTopics).map((topic) => new TopicRecord(topic))
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
    mode: undefined,
    name: undefined,
    description: undefined,
    date: undefined,
    priority: undefined,
    visibility: undefined,
    visibilityTranslated: undefined,
    slug: undefined,
    articlesCount: undefined,
    viewsCount: undefined,
    clicksCount: undefined,
    searchesCount: undefined,
    user: new UserRecord(),
    settings: new SettingsRecord(),
    tags: List(),
    contributors: List()
}) {
    constructor({user, settings, tags, contributors, ...props} = {}) {
        super({
            ...props,
            user: new UserRecord(user),
            settings: new SettingsRecord(settings),
            tags: List(tags).map((tag) => new TagRecord(tag)),
            contributors: List(contributors).map((user) => new UserRecord(user))
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
    childOnly: undefined,
    parentIds: undefined,
    parents: List(),
    childIds: undefined,
    children: List(),
    slug: undefined,
    viewsCount: undefined,
    clicksCount: undefined,
    searchesCount: undefined,
    topicIds: undefined,
    userId: undefined,
    user: new UserRecord()
}) {
    constructor({user, parents, children, ...props} = {}) {
        super({
            ...props,
            user: new UserRecord(user),
            parents: List(parents).map((tag) => new TagRecord(tag)),
            children: List(children).map((tag) => new TagRecord(tag))
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
    language: undefined,
    visibility: undefined,
    visibilityTranslated: undefined,
    defaultPicture: undefined,
    slug: undefined,
    picture_ids: undefined,
    publicShareLink: undefined,
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
    tagNames: List(),
    parentTagIds: List(),
    childTagIds: List(),
    newTagIds: List()
}) {
    constructor({user, tags, ...props} = {}) {
        super({
            ...props,
            user: new UserRecord(user),
            tags: List(tags).map((tag) => new TagRecord(tag))
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

export const BookmarkRecord = new Record({
    id: undefined,
    userId: undefined,
    bookmarkedId: undefined,
    bookmarkedType: undefined,
    follow: undefined,
    name: undefined,
    parentSlug: undefined,
    slug: undefined
});
