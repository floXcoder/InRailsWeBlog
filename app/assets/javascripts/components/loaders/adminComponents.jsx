'use strict';

export const lazyWithPreload = (factory) => {
    const Component = React.lazy(factory);
    Component.preload = factory;
    return Component;
};

// webpackChunkName cannot contain "tracking"!!!
export const AdminDashboard = lazyWithPreload(() => import(/* webpackChunkName: "admins-dashboard" */ '../admins/dashboard'));

export const AdminUsers = lazyWithPreload(() => import(/* webpackChunkName: "admins-users" */ '../admins/users'));

export const AdminTags = lazyWithPreload(() => import(/* webpackChunkName: "admins-rides" */ '../admins/tags'));

export const AdminTopics = lazyWithPreload(() => import(/* webpackChunkName: "admins-rides" */ '../admins/topics'));

export const AdminArticles = lazyWithPreload(() => import(/* webpackChunkName: "admins-rides" */ '../admins/articles'));

export const AdminComments = lazyWithPreload(() => import(/* webpackChunkName: "admins-rides" */ '../admins/comments'));

export const AdminBlogs = lazyWithPreload(() => import(/* webpackChunkName: "admins-blogs" */ '../admins/blogs'));

export const AdminSeoData = lazyWithPreload(() => import(/* webpackChunkName: "admins-blogs" */ '../admins/seoData'));

export const AdminLogs = lazyWithPreload(() => import(/* webpackChunkName: "admins-logs" */ '../admins/logs'));

export const AdminCache = lazyWithPreload(() => import(/* webpackChunkName: "admins-cache" */ '../admins/cache'));
