'use strict';

import {
    lazyImporter
} from './lazyLoader';


// webpackChunkName cannot contain "tracking"!!!

export const Home = lazyImporter(() => import(/* webpackChunkName: "home-index" */ '../home/home'));

export const TopicShow = lazyImporter(() => import(/* webpackChunkName: "topic-show" */ '../topics/show'));
export const TopicEdit = lazyImporter(() => import(/* webpackChunkName: "topic-edit" */ '../topics/edit'));
export const TopicEditInventories = lazyImporter(() => import(/* webpackChunkName: "topic-edit-inventories" */ '../topics/editInventories'));
export const TopicPersistence = lazyImporter(() => import(/* webpackChunkName: "topic-persistence" */ '../topics/persistence'));
export const TopicShare = lazyImporter(() => import(/* webpackChunkName: "topic-share" */ '../topics/share'));
export const TopicSort = lazyImporter(() => import(/* webpackChunkName: "topic-sort" */ '../topics/sort'));

export const ArticleIndex = lazyImporter(() => import(/* webpackPrefetch: true, webpackChunkName: "article-index" */ '../articles/index'));
export const ArticleShow = lazyImporter(() => import(/* webpackPrefetch: true, webpackChunkName: "article-show" */ '../articles/show'));
export const ArticleNew = lazyImporter(() => import(/* webpackChunkName: "article-new" */ '../articles/new'));
export const ArticleEdit = lazyImporter(() => import(/* webpackChunkName: "article-edit" */ '../articles/edit'));
export const ArticleHistory = lazyImporter(() => import(/* webpackChunkName: "article-history" */ '../articles/history'));
export const ArticleTracking = lazyImporter(() => import(/* webpackChunkName: "article-tracked" */ '../articles/tracking'));
export const ArticleCompare = lazyImporter(() => import(/* webpackChunkName: "article-compare" */ '../articles/compare'));
export const ArticleShare = lazyImporter(() => import(/* webpackChunkName: "article-share" */ '../articles/share'));
export const ArticleShared = lazyImporter(() => import(/* webpackChunkName: "article-shared" */ '../articles/shared'));
export const ArticleSort = lazyImporter(() => import(/* webpackChunkName: "article-sort" */ '../articles/sort'));
export const ArticleListMode = lazyImporter(() => import(/* webpackChunkName: "article-index-list" */ '../articles/display/modes/list'));
export const ArticleInfiniteMode = lazyImporter(() => import(/* webpackChunkName: "article-index-infinite" */ '../articles/display/modes/infinite'));
export const ArticleMasonryMode = lazyImporter(() => import(/* webpackChunkName: "article-index-masonry" */ '../articles/display/modes/masonry'));
export const ArticleTimelineMode = lazyImporter(() => import(/* webpackChunkName: "article-index-timeline" */ '../articles/display/modes/timeline'));
export const ArticleInlineEditionDisplay = lazyImporter(() => import(/* webpackChunkName: "article-item-edition" */ '../articles/display/items/inlineEdition'));

export const TagIndex = lazyImporter(() => import(/* webpackChunkName: "tag-index" */ '../tags/index'));
export const TagShow = lazyImporter(() => import(/* webpackChunkName: "tag-show" */ '../tags/show'));
export const TagEdit = lazyImporter(() => import(/* webpackChunkName: "tag-edit" */ '../tags/edit'));
export const TagSort = lazyImporter(() => import(/* webpackChunkName: "tag-sort" */ '../tags/sort'));

export const UserHome = lazyImporter(() => import(/* webpackChunkName: "user-home" */ '../users/home'));
// export const UserShow = lazyImporter(() => import(/* webpackChunkName: "user-show" */ '../users/show'));
// export const UserEdit = lazyImporter(() => import(/* webpackChunkName: "user-edit" */ '../users/edit'));
export const UserPreference = lazyImporter(() => import(/* webpackChunkName: "user-preference" */ '../users/preference'));
export const UserSignup = lazyImporter(() => import(/* webpackChunkName: "user-signup" */ '../users/signup'));
export const UserLogin = lazyImporter(() => import(/* webpackChunkName: "user-login" */ '../users/login'));
export const UserPassword = lazyImporter(() => import(/* webpackChunkName: "user-password" */ '../users/password'));
export const UserConfirmation = lazyImporter(() => import(/* webpackChunkName: "user-confirmation" */ '../users/confirmation'));

// export const HomeSearchHeader = lazyImporter(() => import(/* webpackPrefetch: true, webpackChunkName: "search-header" */ '../layouts/header/search'));
export const SearchModule = lazyImporter(() => import(/* webpackChunkName: "search-module" */ '../search/module'));
export const SearchIndex = lazyImporter(() => import(/* webpackChunkName: "search-index" */ '../search/index'));
export const ArticleGridModeSearch = lazyImporter(() => import(/* webpackChunkName: "article-search-masonry" */ '../search/index/display/grid'));

// export const CommentBox = lazyImporter(() => import(/* webpackChunkName: "comment-box" */ '../comments/box'));

export const Editor = lazyImporter(() => import(/* webpackChunkName: "editor" */ '../editor/editor'));

export const About = lazyImporter(() => import(/* webpackChunkName: "static-about" */ '../statics/about'));
export const Terms = lazyImporter(() => import(/* webpackChunkName: "static-terms" */ '../statics/terms'));
export const Privacy = lazyImporter(() => import(/* webpackChunkName: "static-privacy" */ '../statics/privacy'));
