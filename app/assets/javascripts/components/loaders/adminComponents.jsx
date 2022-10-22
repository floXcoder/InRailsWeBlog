'use strict';

import {
    lazyImporter
} from './lazyLoader';


// webpackChunkName cannot contain "tracking"!!!

export const AdminDashboard = lazyImporter(() => import(/* webpackChunkName: "admins-dashboard" */ '../admins/dashboard'));

export const AdminVisits = lazyImporter(() => import(/* webpackChunkName: "admins-visits" */ '../admins/visits'));

export const AdminUsers = lazyImporter(() => import(/* webpackChunkName: "admins-users" */ '../admins/users'));

export const AdminTags = lazyImporter(() => import(/* webpackChunkName: "admins-tags" */ '../admins/tags'));

export const AdminTopics = lazyImporter(() => import(/* webpackChunkName: "admins-topics" */ '../admins/topics'));

export const AdminArticles = lazyImporter(() => import(/* webpackChunkName: "admins-articles" */ '../admins/articles'));

export const AdminComments = lazyImporter(() => import(/* webpackChunkName: "admins-comments" */ '../admins/comments'));

export const AdminBlogs = lazyImporter(() => import(/* webpackChunkName: "admins-blogs" */ '../admins/blogs'));

export const AdminSeoData = lazyImporter(() => import(/* webpackChunkName: "admins-seo-data" */ '../admins/seoData'));

export const AdminLogs = lazyImporter(() => import(/* webpackChunkName: "admins-logs" */ '../admins/logs'));

export const AdminCache = lazyImporter(() => import(/* webpackChunkName: "admins-cache" */ '../admins/cache'));
