'use strict';

export const lazyWithPreload = (factory) => {
    const Component = React.lazy(factory);
    Component.preload = factory;
    return Component;
};

// webpackChunkName cannot contain "tracking"!!!

export const Home = lazyWithPreload(() => import(/* webpackChunkName: "home-index" */ '../home/home'));

export const TopicShow = lazyWithPreload(() => import(/* webpackChunkName: "topic-show" */ '../topics/show'));
export const TopicEdit = lazyWithPreload(() => import(/* webpackChunkName: "topic-edit" */ '../topics/edit'));
export const TopicEditInventories = lazyWithPreload(() => import(/* webpackChunkName: "topic-edit-inventories" */ '../topics/editInventories'));
export const TopicPersistence = lazyWithPreload(() => import(/* webpackChunkName: "topic-persistence" */ '../topics/persistence'));
export const TopicShare = lazyWithPreload(() => import(/* webpackChunkName: "topic-share" */ '../topics/share'));
export const TopicSort = lazyWithPreload(() => import(/* webpackChunkName: "topic-sort" */ '../topics/sort'));

export const ArticleIndex = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "article-index" */ '../articles/index'));
export const ArticleShow = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "article-show" */ '../articles/show'));
export const ArticleNew = lazyWithPreload(() => import(/* webpackChunkName: "article-new" */ '../articles/new'));
export const ArticleEdit = lazyWithPreload(() => import(/* webpackChunkName: "article-edit" */ '../articles/edit'));
export const ArticleHistory = lazyWithPreload(() => import(/* webpackChunkName: "article-history" */ '../articles/history'));
export const ArticleTracking = lazyWithPreload(() => import(/* webpackChunkName: "article-tracker" */ '../articles/tracking'));
export const ArticleCompare = lazyWithPreload(() => import(/* webpackChunkName: "article-compare" */ '../articles/compare'));
export const ArticleShare = lazyWithPreload(() => import(/* webpackChunkName: "article-share" */ '../articles/share'));
export const ArticleShared = lazyWithPreload(() => import(/* webpackChunkName: "article-share" */ '../articles/shared'));
export const ArticleSort = lazyWithPreload(() => import(/* webpackChunkName: "article-sort" */ '../articles/sort'));
export const ArticleListMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-list" */ '../articles/display/modes/list'));
export const ArticleInfiniteMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-infinite" */ '../articles/display/modes/infinite'));
export const ArticleMasonryMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-masonry" */ '../articles/display/modes/masonry'));
export const ArticleTimelineMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-timeline" */ '../articles/display/modes/timeline'));
export const ArticleInlineEditionDisplay = lazyWithPreload(() => import(/* webpackChunkName: "article-item-edition" */ '../articles/display/items/inlineEdition'));

export const TagIndex = lazyWithPreload(() => import(/* webpackChunkName: "tag-index" */ '../tags/index'));
export const TagShow = lazyWithPreload(() => import(/* webpackChunkName: "tag-show" */ '../tags/show'));
export const TagEdit = lazyWithPreload(() => import(/* webpackChunkName: "tag-edit" */ '../tags/edit'));
export const TagSort = lazyWithPreload(() => import(/* webpackChunkName: "tag-sort" */ '../tags/sort'));

export const UserHome = lazyWithPreload(() => import(/* webpackChunkName: "user-home" */ '../users/home'));
// export const UserShow = lazyWithPreload(() => import(/* webpackChunkName: "user-show" */ '../users/show'));
// export const UserEdit = lazyWithPreload(() => import(/* webpackChunkName: "user-edit" */ '../users/edit'));
export const UserPreference = lazyWithPreload(() => import(/* webpackChunkName: "user-preference" */ '../users/preference'));
export const UserSignup = lazyWithPreload(() => import(/* webpackChunkName: "user-signup" */ '../users/signup'));
export const UserLogin = lazyWithPreload(() => import(/* webpackChunkName: "user-login" */ '../users/login'));
export const UserPassword = lazyWithPreload(() => import(/* webpackChunkName: "user-password" */ '../users/password'));
export const UserConfirmation = lazyWithPreload(() => import(/* webpackChunkName: "user-confirmation" */ '../users/confirmation'));

export const HomeSearchHeader = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "search-header" */ '../layouts/header/search'));
export const SearchModule = lazyWithPreload(() => import(/* webpackChunkName: "search-module" */ '../search/module'));
export const SearchIndex = lazyWithPreload(() => import(/* webpackChunkName: "search-index" */ '../search/index'));
export const ArticleGridModeSearch = lazyWithPreload(() => import(/* webpackChunkName: "article-search-masonry" */ '../search/index/display/grid'));

// export const CommentBox = lazyWithPreload(() => import(/* webpackChunkName: "comment-box" */ '../comments/box'));

export const Editor = lazyWithPreload(() => import(/* webpackChunkName: "editor" */ '../editor/editor'));

export const About = lazyWithPreload(() => import(/* webpackChunkName: "static-about" */ '../statics/about'));
export const Terms = lazyWithPreload(() => import(/* webpackChunkName: "static-terms" */ '../statics/terms'));
export const Privacy = lazyWithPreload(() => import(/* webpackChunkName: "static-privacy" */ '../statics/privacy'));
