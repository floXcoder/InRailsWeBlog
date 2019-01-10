'use strict';

import {
    lazy
} from 'react';

const HomeHome = lazy(() => import(/* webpackChunkName: "home-index" */ './components/home/home'));

const TopicModal = lazy(() => import(/* webpackChunkName: "topic-new" */ './components/topics/modal'));

const ArticleIndex = lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "article-index" */ './components/articles/index'));

const ArticleShow = lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "article-show" */ './components/articles/show'));
const ArticleNew = lazy(() => import(/* webpackChunkName: "article-new" */ './components/articles/new'));
const ArticleEdit = lazy(() => import(/* webpackChunkName: "article-edit" */ './components/articles/edit'));
const ArticleHistory = lazy(() => import(/* webpackChunkName: "article-history" */ './components/articles/history'));
const ArticleSort = lazy(() => import(/* webpackChunkName: "article-sort" */ './components/articles/sort'));

const TagIndex = lazy(() => import(/* webpackChunkName: "tag-index" */ './components/tags/index'));
const TagShow = lazy(() => import(/* webpackChunkName: "tag-show" */ './components/tags/show'));
const TagEdit = lazy(() => import(/* webpackChunkName: "tag-edit" */ './components/tags/edit'));
const TagSort = lazy(() => import(/* webpackChunkName: "tag-sort" */ './components/tags/sort'));

const UserHome = lazy(() => import(/* webpackChunkName: "user-home" */ './components/users/home'));
// const UserShow = lazy(() => import(/* webpackChunkName: "user-show" */ './components/users/show'));
// const UserEdit = lazy(() => import(/* webpackChunkName: "user-edit" */ './components/users/edit'));

const SearchModule = lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "search-module" */ './components/search/module'));
const SearchIndex = lazy(() => import(/* webpackPrefetch: true, webpackChunkName: "search-index" */ './components/search/index'));

import NotFound from './components/layouts/notFound';

export default {
    // Rails routes:
    // /api/v1/*
    // /signup
    // /login
    // /logout
    // /admin/*
    // /terms_of_use
    // /errors/*
    // /404
    // /422
    // /500

    static: {
        home: [
            {
                path: '/',
                exact: true,
                component: () => HomeHome
            },
            {
                path: '/search',
                noBreadcrumb: false,
                component: () => SearchIndex
            },
            // tag
            {
                path: '/tags/:tagSlug',
                exact: true,
                component: () => TagShow
            },
            {
                path: '/tags',
                exact: true,
                component: () => TagIndex
            },
            // tagged
            {
                path: '/tagged/:tagSlug/:childTagSlug?',
                exact: false,
                component: () => ArticleIndex
            },
            // user: topics
            {
                path: '/users/:userSlug/topics/:topicSlug',
                exact: true,
                component: () => ArticleIndex
            },
            // user : tags
            {
                path: '/users/:userSlug/topics/:topicSlug/tags',
                exact: true,
                component: () => TagIndex
            },
            // user: articles
            {
                path: '/users/:userSlug',
                exact: true,
                component: () => ArticleIndex
            },
            {
                path: '/users/:userSlug/articles/:articleSlug',
                exact: true,
                component: () => ArticleShow
            },
            // Miscellaneous
            {
                path: '/404',
                component: () => NotFound
            }
        ],
        user: [
            {
                path: '/',
                exact: true,
                tagCloud: true,
                component: () => UserHome
            },
            // search
            {
                path: '/search',
                noBreadcrumb: true,
                component: () => SearchIndex
            },
            // tag
            {
                path: '/tags/:tagSlug/edit',
                exact: true,
                tagCloud: true,
                component: () => TagEdit
            },
            {
                path: '/tags/:userSlug/sort',
                exact: true,
                tagCloud: true,
                component: () => TagSort
            },
            {
                path: '/tags/:tagSlug',
                exact: true,
                tagCloud: true,
                component: () => TagShow
            },
            {
                path: '/tags',
                exact: true,
                tagCloud: true,
                component: () => TagIndex
            },
            // tagged
            {
                path: '/tagged/:tagSlug/:childTagSlug?',
                exact: false,
                tagCloud: true,
                articleSidebar: true,
                redirect: (route, previousRoute) => !route.tagCloud || !previousRoute.tagCloud,
                redirectPath: (options = {}) => `/users/${options.userSlug}/topics/${options.topicSlug}/tagged/${options.tagSlug}` + (options.childTagSlug ? `/${options.childTagSlug}` : ''),
                component: () => ArticleIndex
            },
            {
                path: '/users/:userSlug/topics/:topicSlug/tagged/:tagSlug/:childTagSlug?',
                exact: false,
                articleSidebar: true,
                component: () => ArticleIndex
            },
            // user: topics
            {
                path: '/users/:userSlug/topics',
                exact: true,
                component: () => UserHome
            },
            {
                path: '/users/:userSlug/topics/:topicSlug',
                exact: true,
                articleSidebar: true,
                component: () => ArticleIndex
            },
            // user : tags
            {
                path: '/users/:userSlug/topics/:topicSlug/tags',
                exact: true,
                component: () => TagIndex
            },
            // user: articles
            {
                path: '/users/:userSlug/topics/:topicSlug/sort',
                exact: true,
                component: () => ArticleSort
            },
            {
                path: '/users/:userSlug/topics/:topicSlug/article-new',
                exact: true,
                component: () => ArticleNew
            },
            {
                path: '/users/:userSlug/articles/:articleSlug/edit',
                exact: true,
                component: () => ArticleEdit
            },
            {
                path: '/users/:userSlug/articles/:articleSlug/history',
                exact: true,
                component: () => ArticleHistory
            },
            {
                path: '/users/:userSlug/articles/:articleSlug',
                exact: true,
                component: () => ArticleShow
            },
            {
                path: '/users/:userSlug',
                exact: true,
                component: () => UserHome
            },
            // Miscellaneous
            {
                path: '/404',
                component: () => NotFound
            }
        ]
    },

    // Permanents is based on hash value in URL
    permanents: {
        header: [
            {
                path: 'search',
                component: () => SearchModule
            }
        ],
        main: [
            {
                path: 'new-article',
                component: () => ArticleNew
            },
            {
                path: 'new-topic',
                component: () => TopicModal
            }
        ]
    }

    // Other routes are resolved by Rails router
    // Otherwise use Redirect from Router to always return an existing route
};
