'use strict';

import LazyLoaderFactory from './components/loaders/lazyLoader';

const ArticleIndexLoader = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "article-index" */ './components/articles/index')}
                       props={props}/>
);
const ArticleShowLoader = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "article-show" */ './components/articles/show')}
                       props={props}/>
);
const ArticleNewLoader = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "article-new" */ './components/articles/new')}
                       props={props}/>
);
const ArticleEditLoader = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "article-edit" */ './components/articles/edit')}
                       props={props}/>
);

const TagShowLoader = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "tag-show" */ './components/tags/show')}
                       props={props}/>
);
const TagEditLoader = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "tag-edit" */ './components/tags/edit')}
                       props={props}/>
);

const UserShowLoader = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "user-show" */ './components/users/show')}
                       props={props}/>
);
const UserEditLoader = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "user-edit" */ './components/users/edit')}
                       props={props}/>
);

export default {
    init: {
        path: '/',
        exact: true
    },

    home: {
        views: [
            {
                path: '/',
                exact: true,
                component: ArticleIndexLoader
            },
            {
                path: '/topic/:topicSlug',
                exact: true,
                component: ArticleIndexLoader
            },
            {
                path: '/topic/:topicSlug/tags/:tagSlug',
                exact: true,
                component: ArticleIndexLoader
            },
            {
                path: '/topic/:topicSlug/tags/:tagParentSlug/:tagChildSlug',
                exact: true,
                component: ArticleIndexLoader
            },
            {
                path: '/topic/:topicSlug/user/:userSlug',
                component: ArticleIndexLoader
            },
            {
                path: '/topic/:topicSlug/article/new',
                exact: true,
                component: ArticleNewLoader
            },
            {
                path: '/article/tags/:tagSlug',
                component: ArticleIndexLoader
            },
            {
                path: '/topic/:topicSlug/article/:articleSlug',
                component: ArticleShowLoader
            },
            {
                path: '/topic/:topicSlug/article/:articleSlug/edit',
                component: ArticleEditLoader
            }
        ]
    }
};
