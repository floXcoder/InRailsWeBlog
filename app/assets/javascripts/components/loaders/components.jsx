'use strict';

export const lazyWithPreload = (factory) => {
    const Component = React.lazy(factory);
    Component.preload = factory;
    return Component;
};

export const HomeHome = lazyWithPreload(() => import(/* webpackChunkName: "home-index" */ '../home/home'));

export const TopicPersistence = lazyWithPreload(() => import(/* webpackChunkName: "topic-persistence" */ '../topics/persistence'));
export const TopicShare = lazyWithPreload(() => import(/* webpackChunkName: "topic-share" */ '../topics/share'));

export const ArticleIndex = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "article-index" */ '../articles/index'));
export const ArticleShow = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "article-show" */ '../articles/show'));
export const ArticleNew = lazyWithPreload(() => import(/* webpackChunkName: "article-new" */ '../articles/new'));
export const ArticleEdit = lazyWithPreload(() => import(/* webpackChunkName: "article-edit" */ '../articles/edit'));
export const ArticleHistory = lazyWithPreload(() => import(/* webpackChunkName: "article-history" */ '../articles/history'));
export const ArticleSort = lazyWithPreload(() => import(/* webpackChunkName: "article-sort" */ '../articles/sort'));
export const ArticleListMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-list" */ '../articles/display/modes/list'));
export const ArticleInfiniteMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-infinite" */ '../articles/display/modes/infinite'));
export const ArticleMasonryMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-masonry" */ '../articles/display/modes/masonry'));
export const ArticleTimelineMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-timeline" */ '../articles/display/modes/timeline'));
export const ArticleInlineEditionDisplay = lazyWithPreload(() => import(/* webpackChunkName: "article-item-edition" */ '../articles/display/inlineEdition'));

export const TagIndex = lazyWithPreload(() => import(/* webpackChunkName: "tag-index" */ '../tags/index'));
export const TagShow = lazyWithPreload(() => import(/* webpackChunkName: "tag-show" */ '../tags/show'));
export const TagEdit = lazyWithPreload(() => import(/* webpackChunkName: "tag-edit" */ '../tags/edit'));
export const TagSort = lazyWithPreload(() => import(/* webpackChunkName: "tag-sort" */ '../tags/sort'));

export const UserHome = lazyWithPreload(() => import(/* webpackChunkName: "user-home" */ '../users/home'));
// export const UserShow = lazyWithPreload(() => import(/* webpackChunkName: "user-show" */ '../users/show'));
// export const UserEdit = lazyWithPreload(() => import(/* webpackChunkName: "user-edit" */ '../users/edit'));
export const UserSignup = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "user-signup" */ '../users/signup'));
export const UserLogin = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "user-login" */ '../users/login'));
export const UserPreference = lazyWithPreload(() => import(/* webpackChunkName: "user-preference" */ '../users/preference'));

export const SearchModule = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "search-module" */ '../search/module'));
export const SearchIndex = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "search-index" */ '../search/index'));
export const HomeHeaderSearch = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "search-header" */ '../layouts/header/search'));
export const ArticleGridModeSearch = lazyWithPreload(() => import(/* webpackChunkName: "article-search-masonry" */ '../search/index/display/grid'));
