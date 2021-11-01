'use strict';

import RouteManager from '../modules/routeManager';

// Common routes
export const rootPath = (locale = window.locale) => RouteManager.routeBuilder('/', locale);

// Search routes
export const searchPath = (locale = window.locale) => RouteManager.routeBuilder('/search', locale);

// Tags routes
export const tagsPath = (locale = window.locale) => RouteManager.routeBuilder('/tags', locale);

export const topicTagsPath = (userSlug, topicSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/topics/${topicSlug}/tags`, locale);

export const showTagPath = (tagSlug, locale = window.locale) => RouteManager.routeBuilder(`/tags/${tagSlug}`, locale);
export const editTagPath = (tagSlug, locale = window.locale) => RouteManager.routeBuilder(`/tags/${tagSlug}/edit`, locale);
export const sortTagPath = (userSlug, locale = window.locale) => RouteManager.routeBuilder(`/tags/${userSlug}/sort`, locale);

// Topic routes
export const userTopicPath = (userSlug, topicSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/topics/${topicSlug}/show`, locale);
export const editTopicPath = (userSlug, topicSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/topics/${topicSlug}/edit`, locale);
export const editInventoriesTopicPath = (userSlug, topicSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/topics/${topicSlug}/edit-inventories`, locale);

// Articles routes
export const userArticlesPath = (userSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}`, locale);
export const topicArticlesPath = (userSlug, topicSlug, topicType = 'topics', locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/${topicType}/${topicSlug}`, locale);
export const taggedTopicArticlesPath = (userSlug, topicSlug, tagSlug, childTagSlug, topicType = 'topics', locale = window.locale) => childTagSlug ? RouteManager.routeBuilder(`/users/${userSlug}/${topicType}/${topicSlug}/tagged/${tagSlug}/${childTagSlug}`, locale) : RouteManager.routeBuilder(`/users/${userSlug}/${topicType}/${topicSlug}/tagged/${tagSlug}`, locale);
export const taggedArticlesPath = (tagSlug, childTagSlug, locale = window.locale) => childTagSlug ? RouteManager.routeBuilder(`/tagged/${tagSlug}/${childTagSlug}`, locale) : RouteManager.routeBuilder(`/tagged/${tagSlug}`, locale);

export const orderTopicArticlesPath = (userSlug, topicSlug, order, topicType = 'topics', locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/${topicType}/${topicSlug}/order/${order}`, locale);
export const sortTopicArticlesPath = (userSlug, topicSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/topics/${topicSlug}/sort`, locale);

export const userArticlePath = (userSlug, articleSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/articles/${articleSlug}`, locale);
export const sharedArticlePath = (articleSlug, publicLink, locale = window.locale) => RouteManager.routeBuilder(`/articles/shared/${articleSlug}/${publicLink}`, locale);

export const newArticlePath = (userSlug, topicSlug, topicType = 'topics', locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/${topicType}/${topicSlug}/article-new`, locale);
export const editArticlePath = (userSlug, articleSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/articles/${articleSlug}/edit`, locale);
export const historyArticlePath = (userSlug, articleSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/articles/${articleSlug}/history`, locale);

// Users routes
export const userHomePath = (userSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/topics`, locale);
export const userTopicsPath = (userSlug, locale = window.locale) => RouteManager.routeBuilder(`/users/${userSlug}/topics`, locale);
// export const userPath = (userSlug) => RouteManager.routeBuilder(`/users/${userSlug}/show`, locale);
// export const userEditPath = (userSlug) => RouteManager.routeBuilder(`/users/${userSlug}/edit`, locale);
export const newPasswordPath = (locale = window.locale) => RouteManager.routeBuilder('/users/password/new', locale);
export const editPasswordPath = (locale = window.locale) => RouteManager.routeBuilder('/users/password/edit', locale);
export const userConfirmationPath = (locale = window.locale) => RouteManager.routeBuilder('/users/confirmation', locale);

// Static routes
export const about = (locale = window.locale) => RouteManager.routeBuilder('/about', locale);
export const terms = (locale = window.locale) => RouteManager.routeBuilder('/terms', locale);
export const privacy = (locale = window.locale) => RouteManager.routeBuilder('/privacy', locale);

// URL hash params
export const searchParam = 'search';

export const newTopicParam = 'new-topic';
export const shareTopicParam = 'share-topic';
export const sortTopicParam = 'sort-topic';

export const trackingArticleParam = 'tracking-article';
export const compareArticleParam = 'compare-article';
export const shareArticleParam = 'share-article';

// Not found routes
export const notFoundPath = () => '/404';
