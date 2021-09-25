'use strict';

import {
    manageImportError
} from '../../actions';

export const lazyWithPreload = (factory) => {
    const Component = React.lazy(factory);
    Component.preload = factory;
    return Component;
};

// webpackChunkName cannot contain "tracking"!!!

export const Home = lazyWithPreload(() => import(/* webpackChunkName: "home-index" */ '../home/home').catch(manageImportError));

export const TopicShow = lazyWithPreload(() => import(/* webpackChunkName: "topic-show" */ '../topics/show').catch(manageImportError));
export const TopicEdit = lazyWithPreload(() => import(/* webpackChunkName: "topic-edit" */ '../topics/edit').catch(manageImportError));
export const TopicEditInventories = lazyWithPreload(() => import(/* webpackChunkName: "topic-edit-inventories" */ '../topics/editInventories').catch(manageImportError));
export const TopicPersistence = lazyWithPreload(() => import(/* webpackChunkName: "topic-persistence" */ '../topics/persistence').catch(manageImportError));
export const TopicShare = lazyWithPreload(() => import(/* webpackChunkName: "topic-share" */ '../topics/share').catch(manageImportError));
export const TopicSort = lazyWithPreload(() => import(/* webpackChunkName: "topic-sort" */ '../topics/sort').catch(manageImportError));

export const ArticleIndex = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "article-index" */ '../articles/index').catch(manageImportError));
export const ArticleShow = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "article-show" */ '../articles/show').catch(manageImportError));
export const ArticleNew = lazyWithPreload(() => import(/* webpackChunkName: "article-new" */ '../articles/new').catch(manageImportError));
export const ArticleEdit = lazyWithPreload(() => import(/* webpackChunkName: "article-edit" */ '../articles/edit').catch(manageImportError));
export const ArticleHistory = lazyWithPreload(() => import(/* webpackChunkName: "article-history" */ '../articles/history').catch(manageImportError));
export const ArticleTracking = lazyWithPreload(() => import(/* webpackChunkName: "article-tracked" */ '../articles/tracking').catch(manageImportError));
export const ArticleCompare = lazyWithPreload(() => import(/* webpackChunkName: "article-compare" */ '../articles/compare').catch(manageImportError));
export const ArticleShare = lazyWithPreload(() => import(/* webpackChunkName: "article-share" */ '../articles/share').catch(manageImportError));
export const ArticleShared = lazyWithPreload(() => import(/* webpackChunkName: "article-shared" */ '../articles/shared').catch(manageImportError));
export const ArticleSort = lazyWithPreload(() => import(/* webpackChunkName: "article-sort" */ '../articles/sort').catch(manageImportError));
export const ArticleListMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-list" */ '../articles/display/modes/list').catch(manageImportError));
export const ArticleInfiniteMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-infinite" */ '../articles/display/modes/infinite').catch(manageImportError));
export const ArticleMasonryMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-masonry" */ '../articles/display/modes/masonry').catch(manageImportError));
export const ArticleTimelineMode = lazyWithPreload(() => import(/* webpackChunkName: "article-index-timeline" */ '../articles/display/modes/timeline').catch(manageImportError));
export const ArticleInlineEditionDisplay = lazyWithPreload(() => import(/* webpackChunkName: "article-item-edition" */ '../articles/display/items/inlineEdition').catch(manageImportError));

export const TagIndex = lazyWithPreload(() => import(/* webpackChunkName: "tag-index" */ '../tags/index').catch(manageImportError));
export const TagShow = lazyWithPreload(() => import(/* webpackChunkName: "tag-show" */ '../tags/show').catch(manageImportError));
export const TagEdit = lazyWithPreload(() => import(/* webpackChunkName: "tag-edit" */ '../tags/edit').catch(manageImportError));
export const TagSort = lazyWithPreload(() => import(/* webpackChunkName: "tag-sort" */ '../tags/sort').catch(manageImportError));

export const UserHome = lazyWithPreload(() => import(/* webpackChunkName: "user-home" */ '../users/home').catch(manageImportError));
// export const UserShow = lazyWithPreload(() => import(/* webpackChunkName: "user-show" */ '../users/show').catch(manageImportError));
// export const UserEdit = lazyWithPreload(() => import(/* webpackChunkName: "user-edit" */ '../users/edit').catch(manageImportError));
export const UserPreference = lazyWithPreload(() => import(/* webpackChunkName: "user-preference" */ '../users/preference').catch(manageImportError));
export const UserSignup = lazyWithPreload(() => import(/* webpackChunkName: "user-signup" */ '../users/signup').catch(manageImportError));
export const UserLogin = lazyWithPreload(() => import(/* webpackChunkName: "user-login" */ '../users/login').catch(manageImportError));
export const UserPassword = lazyWithPreload(() => import(/* webpackChunkName: "user-password" */ '../users/password').catch(manageImportError));
export const UserConfirmation = lazyWithPreload(() => import(/* webpackChunkName: "user-confirmation" */ '../users/confirmation').catch(manageImportError));

// export const HomeSearchHeader = lazyWithPreload(() => import(/* webpackPrefetch: true, webpackChunkName: "search-header" */ '../layouts/header/search').catch(manageImportError));
export const SearchModule = lazyWithPreload(() => import(/* webpackChunkName: "search-module" */ '../search/module').catch(manageImportError));
export const SearchIndex = lazyWithPreload(() => import(/* webpackChunkName: "search-index" */ '../search/index').catch(manageImportError));
export const ArticleGridModeSearch = lazyWithPreload(() => import(/* webpackChunkName: "article-search-masonry" */ '../search/index/display/grid').catch(manageImportError));

// export const CommentBox = lazyWithPreload(() => import(/* webpackChunkName: "comment-box" */ '../comments/box').catch(manageImportError));

export const Editor = lazyWithPreload(() => import(/* webpackChunkName: "editor" */ '../editor/editor').catch(manageImportError));

export const About = lazyWithPreload(() => import(/* webpackChunkName: "static-about" */ '../statics/about').catch(manageImportError));
export const Terms = lazyWithPreload(() => import(/* webpackChunkName: "static-terms" */ '../statics/terms').catch(manageImportError));
export const Privacy = lazyWithPreload(() => import(/* webpackChunkName: "static-privacy" */ '../statics/privacy').catch(manageImportError));
