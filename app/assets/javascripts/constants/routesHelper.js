'use strict';

// Build routes from translated routes in locales/routes.*.yml
const buildRoute = (locale, path) => [window.localizedRoutes[locale].locale].concat(path.substr(1).split('/').map((p) => window.localizedRoutes[locale][p] || p)).join('/');
const buildRoutes = (path) => window.locales.map((l) => [window.localizedRoutes[l].locale].concat(path.substr(1).split('/').map((p) => p.includes('|') ? '(' + p.substr(1).slice(0, -1).split('|').map((s) => window.localizedRoutes[l][s] || s).join('|') + ')' : window.localizedRoutes[l][p] || p)).join('/'));
const routeBuilder = (path, locale) => locale ? buildRoute(locale, path) : buildRoutes(path);

// Common routes
export const rootPath = (locale = window.locale) => routeBuilder('/', locale);

// Search routes
export const searchPath = (locale = window.locale) => routeBuilder(locale === false ? '/search/(.*)' : '/search/', locale);

// Tags routes
export const tagsPath = (locale = window.locale) => routeBuilder('/tags', locale);

export const topicTagsPath = (userSlug, topicSlug, locale = window.locale) => routeBuilder(`/users/${userSlug}/topics/${topicSlug}/tags`, locale);

export const showTagPath = (tagSlug, locale = window.locale) => routeBuilder(`/tags/${tagSlug}`, locale);
export const editTagPath = (tagSlug, locale = window.locale) => routeBuilder(`/tags/${tagSlug}/edit`, locale);
export const sortTagPath = (userSlug, locale = window.locale) => routeBuilder(`/tags/${userSlug}/sort`, locale);

// Topic routes
export const userTopicsPath = (userSlug, locale = window.locale) => routeBuilder(`/users/${userSlug}/topics`, locale);
export const userTopicPath = (userSlug, topicSlug, locale = window.locale) => routeBuilder(`/users/${userSlug}/topics/${topicSlug}/show`, locale);
export const editTopicPath = (userSlug, topicSlug, locale = window.locale) => routeBuilder(`/users/${userSlug}/topics/${topicSlug}/edit`, locale);
export const editInventoriesTopicPath = (userSlug, topicSlug, locale = window.locale) => routeBuilder(`/users/${userSlug}/topics/${topicSlug}/edit-inventories`, locale);

// Articles routes
export const topicArticlesPath = (userSlug, topicSlug, topicType = 'topics', locale = window.locale) => routeBuilder(`/users/${userSlug}/${topicType}/${topicSlug}`, locale);
export const taggedTopicArticlesPath = (userSlug, topicSlug, tagSlug, childTagSlug, topicType = 'topics', locale = window.locale) => childTagSlug ? routeBuilder(`/users/${userSlug}/${topicType}/${topicSlug}/tagged/${tagSlug}/${childTagSlug}`, locale) : routeBuilder(`/users/${userSlug}/${topicType}/${topicSlug}/tagged/${tagSlug}`, locale);
export const taggedArticlesPath = (tagSlug, childTagSlug, locale = window.locale) => childTagSlug ? routeBuilder(`/tagged/${tagSlug}/${childTagSlug}`, locale) : routeBuilder(`/tagged/${tagSlug}`, locale);
export const userArticlesPath = (userSlug, locale = window.locale) => routeBuilder(`/users/${userSlug}`, locale);

export const orderTopicArticlesPath = (userSlug, topicSlug, order, topicType = 'topics', locale = window.locale) => routeBuilder(`/users/${userSlug}/${topicType}/${topicSlug}/order/${order}`, locale);
export const sortTopicArticlesPath = (userSlug, topicSlug, locale = window.locale) => routeBuilder(`/users/${userSlug}/topics/${topicSlug}/sort`, locale);

export const userArticlePath = (userSlug, articleSlug, locale = window.locale) => routeBuilder(`/users/${userSlug}/articles/${articleSlug}`, locale);
export const sharedArticlePath = (articleSlug, publicLink, locale = window.locale) => routeBuilder(`/articles/shared/${articleSlug}/${publicLink}`, locale);

export const newArticlePath = (userSlug, topicSlug, topicType = 'topics', locale = window.locale) => routeBuilder(`/users/${userSlug}/${topicType}/${topicSlug}/article-new`, locale);
export const newArticleRedirectPath = (locale = window.locale) => routeBuilder('/articles/article-new', locale);
export const editArticlePath = (userSlug, articleSlug, locale = window.locale) => routeBuilder(`/users/${userSlug}/articles/${articleSlug}/edit`, locale);
export const historyArticlePath = (userSlug, articleSlug, locale = window.locale) => routeBuilder(`/users/${userSlug}/articles/${articleSlug}/history`, locale);

// Users routes
// export const userPath = (userSlug) => routeBuilder(`/users/${userSlug}/show`, locale);
// export const userEditPath = (userSlug) => routeBuilder(`/users/${userSlug}/edit`, locale);
export const newPasswordPath = (locale = window.locale) => routeBuilder('/users/password/new', locale);
export const editPasswordPath = (locale = window.locale) => routeBuilder('/users/password/edit', locale);
export const userConfirmationPath = (locale = window.locale) => routeBuilder('/users/confirmation', locale);

// Static routes
export const about = (locale = window.locale) => routeBuilder('/about', locale);
export const terms = (locale = window.locale) => routeBuilder('/terms', locale);
export const policy = (locale = window.locale) => routeBuilder('/policy', locale);

// URL hash params
export const searchParam = 'search';

export const newTopicParam = 'new-topic';
export const shareTopicParam = 'share-topic';
export const sortTopicParam = 'sort-topic';

export const trackingArticleParam = 'tracking-article';
export const shareArticleParam = 'share-article';

// Not found routes
export const notFoundPath = () => '/404';
