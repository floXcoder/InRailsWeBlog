import {
    lazyImporter
} from '@js/components/loaders/lazyLoader';


// webpackChunkName cannot contain "tracking"!!!

export const Home = lazyImporter(() => import(/* webpackChunkName: "home-index" */ '@js/components/home/home'));

export const TopicShow = lazyImporter(() => import(/* webpackChunkName: "topic-show" */ '@js/components/topics/show'));
export const TopicEdit = lazyImporter(() => import(/* webpackChunkName: "topic-edit" */ '@js/components/topics/edit'));
export const TopicEditInventories = lazyImporter(() => import(/* webpackChunkName: "topic-edit-inventories" */ '@js/components/topics/editInventories'));
export const TopicPersistence = lazyImporter(() => import(/* webpackChunkName: "topic-persistence" */ '@js/components/topics/persistence'));
export const TopicShare = lazyImporter(() => import(/* webpackChunkName: "topic-share" */ '@js/components/topics/share'));
export const TopicSort = lazyImporter(() => import(/* webpackChunkName: "topic-sort" */ '@js/components/topics/sort'));

export const ArticleIndex = lazyImporter(() => import(/* webpackPrefetch: true, webpackChunkName: "article-index" */ '@js/components/articles/index'));
export const ArticleShow = lazyImporter(() => import(/* webpackPrefetch: true, webpackChunkName: "article-show" */ '@js/components/articles/show'));
export const ArticleNew = lazyImporter(() => import(/* webpackChunkName: "article-new" */ '@js/components/articles/new'));
export const ArticleEdit = lazyImporter(() => import(/* webpackChunkName: "article-edit" */ '@js/components/articles/edit'));
export const ArticleHistory = lazyImporter(() => import(/* webpackChunkName: "article-history" */ '@js/components/articles/history'));
export const ArticleTracking = lazyImporter(() => import(/* webpackChunkName: "article-tracked" */ '@js/components/articles/tracking'));
export const ArticleCompare = lazyImporter(() => import(/* webpackChunkName: "article-compare" */ '@js/components/articles/compare'));
export const ArticleShare = lazyImporter(() => import(/* webpackChunkName: "article-share" */ '@js/components/articles/share'));
export const ArticleShared = lazyImporter(() => import(/* webpackChunkName: "article-shared" */ '@js/components/articles/shared'));
export const ArticleSort = lazyImporter(() => import(/* webpackChunkName: "article-sort" */ '@js/components/articles/sort'));
export const ArticleListMode = lazyImporter(() => import(/* webpackChunkName: "article-index-list" */ '@js/components/articles/display/modes/list'));
export const ArticleInfiniteMode = lazyImporter(() => import(/* webpackChunkName: "article-index-infinite" */ '@js/components/articles/display/modes/infinite'));
export const ArticleMasonryMode = lazyImporter(() => import(/* webpackChunkName: "article-index-masonry" */ '@js/components/articles/display/modes/masonry'));
export const ArticleTimelineMode = lazyImporter(() => import(/* webpackChunkName: "article-index-timeline" */ '@js/components/articles/display/modes/timeline'));
export const ArticleInlineEditionDisplay = lazyImporter(() => import(/* webpackChunkName: "article-item-edition" */ '@js/components/articles/display/items/inlineEdition'));

export const TagIndex = lazyImporter(() => import(/* webpackChunkName: "tag-index" */ '@js/components/tags/index'));
export const TagShow = lazyImporter(() => import(/* webpackChunkName: "tag-show" */ '@js/components/tags/show'));
export const TagEdit = lazyImporter(() => import(/* webpackChunkName: "tag-edit" */ '@js/components/tags/edit'));
export const TagSort = lazyImporter(() => import(/* webpackChunkName: "tag-sort" */ '@js/components/tags/sort'));

export const UserHome = lazyImporter(() => import(/* webpackChunkName: "user-home" */ '@js/components/users/home'));
// export const UserShow = lazyImporter(() => import(/* webpackChunkName: "user-show" */ '@js/components/users/show'));
// export const UserEdit = lazyImporter(() => import(/* webpackChunkName: "user-edit" */ '@js/components/users/edit'));
export const UserPreference = lazyImporter(() => import(/* webpackChunkName: "user-preference" */ '@js/components/users/preference'));
export const UserSignup = lazyImporter(() => import(/* webpackChunkName: "user-signup" */ '@js/components/users/signup'));
export const UserLogin = lazyImporter(() => import(/* webpackChunkName: "user-login" */ '@js/components/users/login'));
export const UserPassword = lazyImporter(() => import(/* webpackChunkName: "user-password" */ '@js/components/users/password'));
export const UserConfirmation = lazyImporter(() => import(/* webpackChunkName: "user-confirmation" */ '@js/components/users/confirmation'));

// export const HomeSearchHeader = lazyImporter(() => import(/* webpackPrefetch: true, webpackChunkName: "search-header" */ '@js/components/layouts/header/search'));
export const SearchModule = lazyImporter(() => import(/* webpackChunkName: "search-module" */ '@js/components/search/module'));
export const SearchIndex = lazyImporter(() => import(/* webpackChunkName: "search-index" */ '@js/components/search/index'));
export const ArticleGridModeSearch = lazyImporter(() => import(/* webpackChunkName: "article-search-masonry" */ '@js/components/search/index/display/grid'));

// export const CommentBox = lazyImporter(() => import(/* webpackChunkName: "comment-box" */ '@js/components/comments/box'));

export const Editor = lazyImporter(() => import(/* webpackChunkName: "editor" */ '@js/components/editor/editor'));

export const About = lazyImporter(() => import(/* webpackChunkName: "static-about" */ '@js/components/statics/about'));
export const Terms = lazyImporter(() => import(/* webpackChunkName: "static-terms" */ '@js/components/statics/terms'));
export const Privacy = lazyImporter(() => import(/* webpackChunkName: "static-privacy" */ '@js/components/statics/privacy'));
