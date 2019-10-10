'use strict';

import * as RouteComponents from './components/loaders/components';

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
                component: () => RouteComponents.HomeHome
            },
            {
                path: '/search',
                noTagSidebar: true,
                noHeaderSearch: true,
                component: () => RouteComponents.SearchIndex
            },
            // tag
            {
                path: '/tags/:tagSlug',
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagShow
            },
            {
                path: '/tags',
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagIndex
            },
            // tagged
            {
                path: '/tagged/:tagSlug/:childTagSlug?',
                exact: false,
                component: () => RouteComponents.ArticleIndex
            },
            // user: password
            {
                path: '/users/password/new',
                exact: true,
                component: () => RouteComponents.UserPassword
            },
            {
                path: '/users/password/edit',
                exact: true,
                component: () => RouteComponents.UserPassword
            },
            // user: articles topic
            {
                path: '/users/:userSlug/topics/:topicSlug',
                exact: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user : tags topic
            {
                path: '/users/:userSlug/topics/:topicSlug/tags',
                exact: true,
                component: () => RouteComponents.TagIndex
            },
            // user: articles
            {
                path: '/users/:userSlug',
                exact: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: '/users/:userSlug/articles/:articleSlug',
                exact: true,
                component: () => RouteComponents.ArticleShow
            },
            // articles: shared
            {
                path: '/articles/shared/:articleSlug/:publicLink',
                exact: true,
                component: () => RouteComponents.ArticleShared
            },
            // Miscellaneous
            {
                path: '/404',
                component: () => NotFound
            },
            {
                component: () => NotFound
            }
        ],
        user: [
            {
                path: '/',
                exact: true,
                tagCloud: true,
                component: () => RouteComponents.UserHome
            },
            // search
            {
                path: '/search',
                searchSidebar: true,
                noTagSidebar: true,
                noHeaderSearch: true,
                component: () => RouteComponents.SearchIndex
            },
            // tag
            {
                path: '/tags/:tagSlug/edit',
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagEdit
            },
            {
                path: '/tags/:userSlug/sort',
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagSort
            },
            {
                path: '/tags/:tagSlug',
                exact: true,
                tagCloud: true,
                component: () => RouteComponents.TagShow
            },
            {
                path: '/tags',
                exact: true,
                tagCloud: true,
                component: () => RouteComponents.TagIndex
            },
            // tagged
            {
                path: '/tagged/:tagSlug/:childTagSlug?',
                exact: false,
                tagCloud: true,
                articleSidebar: true,
                // redirect: (route, previousRoute) => !route.tagCloud || !previousRoute.tagCloud,
                redirect: true,
                redirectPath: (params) => `/users/${params.userSlug}/topics/${params.topicSlug}/tagged/${params.tagSlug}` + (params.childTagSlug ? `/${params.childTagSlug}` : ''),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: '/users/:userSlug/(topics|shared-topics)/:topicSlug/tagged/:tagSlug/:childTagSlug?',
                exact: false,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user: topics
            {
                path: '/users/:userSlug',
                exact: true,
                redirect: true,
                redirectPath: () => '/'
            },
            {
                path: '/users/:userSlug/topics',
                exact: true,
                component: () => RouteComponents.UserHome
            },
            {
                path: '/users/:userSlug/topics/:topicSlug/show',
                exact: true,
                component: () => RouteComponents.TopicShow
            },
            {
                path: '/users/:userSlug/topics/:topicSlug/edit',
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TopicEdit
            },
            {
                path: '/users/:userSlug/topics/:topicSlug/edit-inventories',
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TopicEditInventories
            },
            {
                path: '/users/:userSlug/(topics|shared-topics)/:topicSlug/order/:order',
                exact: true,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: '/users/:userSlug/(topics|shared-topics)/:topicSlug',
                exact: true,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user : tags
            {
                path: '/users/:userSlug/topics/:topicSlug/tags',
                exact: true,
                component: () => RouteComponents.TagIndex
            },
            // user: articles
            {
                path: '/users/:userSlug/topics/:topicSlug/sort',
                exact: true,
                component: () => RouteComponents.ArticleSort
            },
            {
                path: '/users/:userSlug/(topics|shared-topics)/:topicSlug/article-new',
                exact: true,
                component: () => RouteComponents.ArticleNew
            },
            {
                path: '/users/:userSlug/articles/:articleSlug/edit',
                exact: true,
                component: () => RouteComponents.ArticleEdit
            },
            {
                path: '/users/:userSlug/articles/:articleSlug/history',
                exact: true,
                component: () => RouteComponents.ArticleHistory
            },
            {
                path: '/users/:userSlug/articles/:articleSlug',
                exact: true,
                component: () => RouteComponents.ArticleShow
            },
            // Redirection
            {
                path: '/articles/new',
                redirect: true,
                redirectPath: (params) => `/users/${params.userSlug}/topics/${params.topicSlug}/article-new`,
                component: () => RouteComponents.ArticleNew
            },

            // Miscellaneous
            {
                path: '/404',
                component: () => NotFound
            }
        ]
    },

    // Permanents is based on hash value in URL
    hashes: {
        search: [
            {
                path: 'search',
                component: () => RouteComponents.SearchModule
            },
        ],
        topic: [
            {
                path: 'new-topic',
                component: () => RouteComponents.TopicPersistence
            },
            {
                path: 'share-topic',
                component: () => RouteComponents.TopicShare
            },
            {
                path: 'sort-topic',
                component: () => RouteComponents.TopicSort
            }
        ],
        article: [
            {
                path: 'tracking-article',
                component: () => RouteComponents.ArticleTracking
            },
            {
                path: 'share-article',
                component: () => RouteComponents.ArticleShare
            }
        ]
    }

    // Other routes are resolved by Rails router
    // Otherwise use Redirect from Router to always return an existing route
};
