'use strict';

// Common routes
export const rootPath = () => '/';

// Search routes
export const searchPath = () => '/search';

// Tags routes
export const tagsPath = () => `/tags`;

export const topicTagsPath = (userSlug, topicSlug) => `/users/${userSlug}/topics/${topicSlug}/tags`;

export const showTagPath = (tagSlug) => `/tags/${tagSlug}`;
export const editTagPath = (tagSlug) => `/tags/${tagSlug}/edit`;
export const sortTagPath = (tagSlug) => `/tags/${tagSlug}/sort`;

// Topic routes
export const userTopicsPath = (userSlug) => `/users/${userSlug}/topics`;
export const userTopicPath = (userSlug, topicSlug) => `/users/${userSlug}/topics/${topicSlug}/show`;
export const editTopicPath = (userSlug, topicSlug) => `/users/${userSlug}/topics/${topicSlug}/edit`;
export const editInventoriesTopicPath = (userSlug, topicSlug) => `/users/${userSlug}/topics/${topicSlug}/edit-inventories`;

// Articles routes
export const topicArticlesPath = (userSlug, topicSlug, topicType = 'topics') => `/users/${userSlug}/${topicType}/${topicSlug}`;
export const taggedTopicArticlesPath = (userSlug, topicSlug, tagSlug, childTagSlug, topicType = 'topics') => childTagSlug ? `/users/${userSlug}/${topicType}/${topicSlug}/tagged/${tagSlug}` : `/users/${userSlug}/${topicType}/${topicSlug}/tagged/${tagSlug}/${childTagSlug}`;
export const taggedArticlesPath = (tagSlug, childTagSlug) => childTagSlug ? `/tagged/${tagSlug}/${childTagSlug}` : `/tagged/${tagSlug}`;
export const userArticlesPath = (userSlug) => `/users/${userSlug}`;

export const orderTopicArticlesPath = (userSlug, topicSlug, order, topicType = 'topics') => `/users/${userSlug}/${topicType}/${topicSlug}/order/${order}`;
export const sortTopicArticlesPath = (userSlug, topicSlug) => `/users/${userSlug}/topics/${topicSlug}/sort`;

export const userArticlePath = (userSlug, articleSlug) => `/users/${userSlug}/articles/${articleSlug}`;
export const sharedArticlePath = (articleSlug, publicLink) => `/articles/shared/${articleSlug}/${publicLink}`;

export const newArticlePath = (userSlug, topicSlug, topicType = 'topics') => `/users/${userSlug}/${topicType}/${topicSlug}/article-new`;
export const newArticleRedirectPath = () => '/articles/article-new';
export const editArticlePath = (userSlug, articleSlug) => `/users/${userSlug}/articles/${articleSlug}/edit`;
export const historyArticlePath = (userSlug, articleSlug) => `/users/${userSlug}/articles/${articleSlug}/history`;

// Users routes
// export const userPath = (userSlug) => `/users/${userSlug}/show`;
// export const userEditPath = (userSlug) => `/users/${userSlug}/edit`;
export const newPasswordPath = () => '/users/password/new';
export const editPasswordPath = () => '/users/password/edit';

// URL hash params
export const searchParam = 'search';

export const newTopicParam = 'new-topic';
export const shareTopicParam = 'share-topic';
export const sortTopicParam = 'sort-topic';

export const trackingArticleParam = 'tracking-article';
export const shareArticleParam = 'share-article';

// Not found routes
export const notFoundPath = () => '/404';
