'use strict';

import ArticleIndex from './components/loaders/articleIndex';
import ArticleShow from './components/loaders/articleShow';
import ArticleNew from './components/loaders/articleNew';
import ArticleEdit from './components/loaders/articleEdit';

import TagShow from './components/loaders/tagShow';
import TagEdit from './components/loaders/tagEdit';

import UserShow from './components/loaders/userShow';
import UserEdit from './components/loaders/userEdit';

export default {
    // Rails routes:
    // /users/*
    // /signup
    // /login
    // /logout
    // /activities
    // /tags/*
    // /topics/*
    // /articles/*
    // /search/*
    // /comments/*
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
                path: '/user/:topicSlug',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/user/:userSlug/:topicSlug/tagged/:tagParentSlug/:tagChildSlug',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/user/:userSlug/:topicSlug/tagged/:tagSlug',
                exact: true,
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
                path: '/tagged/:tagParentSlug/:tagChildSlug',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/tagged/:tagSlug',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/article/new',
                exact: true,
                component: ArticleNew
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
        ]
    },

    permanents: [
        {
            path: 'new-article',
            component: ArticleNew
        }
    ]

    // Other routes are resolved by Rails router
    // Otherwise use Redirect from Router to always return an existing route
};
