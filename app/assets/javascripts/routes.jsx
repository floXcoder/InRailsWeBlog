'use strict';

import ArticleIndex from './components/loaders/articleIndex';
import ArticleShow from './components/loaders/articleShow';
import ArticleNew from './components/loaders/articleNew';
import ArticleEdit from './components/loaders/articleEdit';
import ArticleHistory from './components/loaders/articleHistory';
import ArticleSort from './components/loaders/articleSort';

import TagIndex from './components/loaders/tagIndex';
import TagShow from './components/loaders/tagShow';
import TagEdit from './components/loaders/tagEdit';
import TagSort from './components/loaders/tagSort';

// import UserShow from './components/loaders/userShow';
// import UserEdit from './components/loaders/userEdit';

import SearchModule from './components/loaders/searchModule';
import SearchIndex from './components/loaders/searchIndex';

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

    loading: {
        path: '/',
        exact: true
    },

    home: {
        views: [
            {
                path: '/',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/search',
                component: SearchIndex
            },
            {
                path: '/user/:topicSlug',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/user/:topicSlug/tags',
                exact: true,
                component: TagIndex
            },
            {
                path: '/user/:topicSlug/sort',
                exact: true,
                component: ArticleSort
            },
            {
                path: '/user/:userSlug/:topicSlug/tagged/:tagSlug/:childTagSlug?',
                exact: false,
                component: ArticleIndex
            },
            {
                path: '/user/:userSlug/:topicSlug',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/user/:userSlug/:topicSlug/:articleSlug',
                exact: true,
                component: ArticleShow
            },
            {
                path: '/topic/:userSlug/:topicSlug',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/tags/:userSlug/sort',
                exact: true,
                component: TagSort
            },
            {
                path: '/tags/:userSlug',
                exact: true,
                component: TagIndex
            },
            {
                path: '/tags',
                exact: true,
                component: TagIndex
            },
            {
                path: '/tag/:tagSlug',
                exact: true,
                component: TagShow
            },
            {
                path: '/tag/:tagSlug/edit',
                exact: true,
                component: TagEdit
            },
            {
                path: '/tagged/:tagSlug/:childTagSlug?',
                exact: false,
                component: ArticleIndex
            },
            {
                path: '/article/new',
                exact: true,
                component: ArticleNew
            },
            {
                path: '/article/:articleSlug/edit',
                exact: true,
                component: ArticleEdit
            },
            {
                path: '/article/:articleSlug/history',
                exact: true,
                component: ArticleHistory
            },
            {
                path: '/article/:topicSlug/:articleSlug',
                exact: true,
                component: ArticleShow
            },
            {
                path: '/article/:articleSlug',
                exact: true,
                component: ArticleShow
            },
            // {
            //     path: '/topic/:topicSlug/tags/:tagSlug',
            //     exact: true,
            //     component: ArticleIndex
            // },
            // {
            //     path: '/topic/:topicSlug/user/:userSlug',
            //     component: ArticleIndex
            // },
            // {
            //     path: '/topic/:topicSlug/article/new',
            //     exact: true,
            //     component: ArticleNew
            // },
            // {
            //     path: '/topic/:topicSlug/article/:articleSlug',
            //     component: ArticleShow
            // },
            // {
            //     path: '/topic/:topicSlug/article/:articleSlug/edit',
            //     component: ArticleEdit
            // }
            {
                path: '/404',
                component: NotFound
            }
        ]
    },

    // Permanents is based on hash value in URL
    permanents: {
        header: [
            {
                path: 'search',
                component: SearchModule
            }
        ],
        main: [
            {
                path: 'new-article',
                component: ArticleNew
            }
        ]
    }

    // Other routes are resolved by Rails router
    // Otherwise use Redirect from Router to always return an existing route
};
