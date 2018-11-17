'use strict';

import HomeHome from './components/loaders/homeHome';

import TopicModal from './components/loaders/topicModal';

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

import UserHome from './components/loaders/userHome';
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

    static: {
        home: [
            {
                path: '/',
                exact: true,
                component: () => HomeHome
            },
            {
                path: '/search',
                hasBreadcrumb: false,
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
                hasBreadcrumb: false,
                component: () => SearchIndex
            },
            // tag
            {
                path: '/tags/:tagSlug/edit',
                exact: true,
                component: () => TagEdit
            },
            {
                path: '/tags/:userSlug/sort',
                exact: true,
                component: () => TagSort
            },
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
                tagCloud: true,
                // redirect: true,
                // redirectCondition: 'tagSlug',
                // redirectPath: (options = {}) => `/users/${options.userSlug}/topics/${options.topicSlug}/tagged/${options.tagSlug}` + (options.childTagSlug ? `/${options.childTagSlug}` : ''),
                component: () => ArticleIndex
            },
            {
                path: '/users/:userSlug/topics/:topicSlug/tagged/:tagSlug/:childTagSlug?',
                exact: false,
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
