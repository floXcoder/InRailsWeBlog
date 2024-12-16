import {
    lazyImporter
} from '@js/components/loaders/lazyLoader';


// webpackChunkName cannot contain "tracking"!!!

export const AdminDashboard = lazyImporter(() => import(/* webpackChunkName: "admins-dashboard" */ '@js/components/admins/dashboard'));

export const AdminVisits = lazyImporter(() => import(/* webpackChunkName: "admins-visits" */ '@js/components/admins/visits'));

export const AdminUsers = lazyImporter(() => import(/* webpackChunkName: "admins-users" */ '@js/components/admins/users'));

export const AdminTags = lazyImporter(() => import(/* webpackChunkName: "admins-tags" */ '@js/components/admins/tags'));

export const AdminTopics = lazyImporter(() => import(/* webpackChunkName: "admins-topics" */ '@js/components/admins/topics'));

export const AdminArticles = lazyImporter(() => import(/* webpackChunkName: "admins-articles" */ '@js/components/admins/articles'));

export const AdminComments = lazyImporter(() => import(/* webpackChunkName: "admins-comments" */ '@js/components/admins/comments'));

export const AdminBlogs = lazyImporter(() => import(/* webpackChunkName: "admins-blogs" */ '@js/components/admins/blogs'));

export const AdminSeoData = lazyImporter(() => import(/* webpackChunkName: "admins-seo-data" */ '@js/components/admins/seoData'));

export const AdminLogs = lazyImporter(() => import(/* webpackChunkName: "admins-logs" */ '@js/components/admins/logs'));

export const AdminCache = lazyImporter(() => import(/* webpackChunkName: "admins-cache" */ '@js/components/admins/cache'));
