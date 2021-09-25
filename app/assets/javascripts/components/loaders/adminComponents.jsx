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
export const AdminDashboard = lazyWithPreload(() => import(/* webpackChunkName: "admins-dashboard" */ '../admins/dashboard').catch(manageImportError));

export const AdminVisits = lazyWithPreload(() => import(/* webpackChunkName: "admins-users" */ '../admins/visits').catch(manageImportError));

export const AdminUsers = lazyWithPreload(() => import(/* webpackChunkName: "admins-users" */ '../admins/users').catch(manageImportError));

export const AdminTags = lazyWithPreload(() => import(/* webpackChunkName: "admins-rides" */ '../admins/tags').catch(manageImportError));

export const AdminTopics = lazyWithPreload(() => import(/* webpackChunkName: "admins-rides" */ '../admins/topics').catch(manageImportError));

export const AdminArticles = lazyWithPreload(() => import(/* webpackChunkName: "admins-rides" */ '../admins/articles').catch(manageImportError));

export const AdminComments = lazyWithPreload(() => import(/* webpackChunkName: "admins-rides" */ '../admins/comments').catch(manageImportError));

export const AdminBlogs = lazyWithPreload(() => import(/* webpackChunkName: "admins-blogs" */ '../admins/blogs').catch(manageImportError));

export const AdminSeoData = lazyWithPreload(() => import(/* webpackChunkName: "admins-blogs" */ '../admins/seoData').catch(manageImportError));

export const AdminLogs = lazyWithPreload(() => import(/* webpackChunkName: "admins-logs" */ '../admins/logs').catch(manageImportError));

export const AdminCache = lazyWithPreload(() => import(/* webpackChunkName: "admins-cache" */ '../admins/cache').catch(manageImportError));
