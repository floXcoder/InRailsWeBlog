'use strict';

import * as RouteComponents from './components/loaders/components';

import * as Routes from './constants/routesHelper';

import NotFound from './components/layouts/notFound';

export default {
    // Rails routes:
    // /api/v1/*
    // /signup
    // /login
    // /logout
    // /admin/*
    // /errors/*
    // /health_check
    // /422
    // /500

    static: {
        common: [
            // Static pages
            {
                path: Routes.about(false),
                component: () => RouteComponents.About
            },
            {
                path: Routes.terms(false),
                component: () => RouteComponents.Terms
            },
            {
                path: Routes.privacy(false),
                component: () => RouteComponents.Privacy
            },
            // User account
            {
                path: Routes.userConfirmationPath(false),
                exact: true,
                component: () => RouteComponents.UserConfirmation
            }
        ],
        notFound: [
            // Miscellaneous
            {
                path: Routes.notFoundPath(false),
                status: 404,
                component: () => NotFound
            },
            {
                status: 404,
                component: () => NotFound
            }
        ],
        home: [
            {
                path: Routes.rootPath(false),
                name: 'Home',
                exact: true,
                component: () => RouteComponents.Home
            },
            {
                path: Routes.searchPath(false),
                exact: false,
                strict: false,
                noTagSidebar: true,
                noHeaderSearch: true,
                component: () => RouteComponents.SearchIndex
            },
            // tag
            {
                path: Routes.showTagPath(':tagSlug', false),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagShow
            },
            {
                path: Routes.tagsPath(false),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagIndex
            },
            // tagged
            {
                path: Routes.taggedArticlesPath(':tagSlug', ':childTagSlug?', false),
                exact: false,
                component: () => RouteComponents.ArticleIndex
            },
            // user: password
            {
                path: Routes.newPasswordPath(false),
                exact: true,
                component: () => RouteComponents.UserPassword
            },
            {
                path: Routes.editPasswordPath(false),
                exact: true,
                component: () => RouteComponents.UserPassword
            },
            // user: articles topic
            {
                path: Routes.topicArticlesPath(':userSlug', ':topicSlug', '(topics|shared-topics)', false),
                exact: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user : tags topic
            {
                path: Routes.topicTagsPath(':userSlug', ':topicSlug', false),
                exact: true,
                component: () => RouteComponents.TagIndex
            },
            // user: articles
            {
                path: Routes.userHomePath(':userSlug', false),
                exact: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.userArticlePath(':userSlug', ':articleSlug', false),
                exact: true,
                component: () => RouteComponents.ArticleShow
            },
            // articles: shared
            {
                path: Routes.sharedArticlePath(':articleSlug', ':publicLink', false),
                exact: true,
                component: () => RouteComponents.ArticleShared
            }
        ],
        user: [
            {
                path: Routes.rootPath(false),
                name: 'UserHome',
                exact: true,
                strict: false,
                noTagSidebar: true,
                component: () => RouteComponents.Home
            },
            // search
            {
                path: Routes.searchPath(false),
                searchSidebar: true,
                noTagSidebar: true,
                noHeaderSearch: true,
                component: () => RouteComponents.SearchIndex
            },
            // tag
            {
                path: Routes.editTagPath(':tagSlug', false),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagEdit
            },
            {
                path: Routes.sortTagPath(':userSlug', false),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagSort
            },
            {
                path: Routes.showTagPath(':tagSlug', false),
                exact: true,
                tagCloud: true,
                component: () => RouteComponents.TagShow
            },
            {
                path: Routes.tagsPath(false),
                exact: true,
                tagCloud: true,
                component: () => RouteComponents.TagIndex
            },
            // tagged
            {
                path: Routes.taggedArticlesPath(':tagSlug', ':childTagSlug?', false),
                exact: false,
                tagCloud: true,
                articleSidebar: true,
                // redirect: (route, previousRoute) => !route.tagCloud || !previousRoute.tagCloud,
                redirect: true,
                redirectPath: (params) => Routes.taggedTopicArticlesPath(params.userSlug, params.topicSlug, params.tagSlug, params.childTagSlug),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', ':childTagSlug?', '(topics|shared-topics)', false),
                exact: false,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user: topics
            {
                path: Routes.userHomePath(':userSlug', false),
                exact: true,
                tagCloud: true,
                component: () => RouteComponents.UserHome
            },
            {
                path: Routes.userTopicsPath(':userSlug', false),
                exact: true,
                component: () => RouteComponents.UserHome
            },
            {
                path: Routes.userTopicPath(':userSlug', ':topicSlug', false),
                exact: true,
                component: () => RouteComponents.TopicShow
            },
            {
                path: Routes.editTopicPath(':userSlug', ':topicSlug', false),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TopicEdit
            },
            {
                path: Routes.editInventoriesTopicPath(':userSlug', ':topicSlug', false),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TopicEditInventories
            },
            {
                path: Routes.orderTopicArticlesPath(':userSlug', ':topicSlug', ':order', '(topics|shared-topics)', false),
                exact: true,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.topicArticlesPath(':userSlug', ':topicSlug', '(topics|shared-topics)', false),
                exact: true,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user : tags
            {
                path: Routes.topicTagsPath(':userSlug', ':topicSlug', false),
                exact: true,
                component: () => RouteComponents.TagIndex
            },
            // user: articles
            {
                path: Routes.sortTopicArticlesPath(':userSlug', ':topicSlug', false),
                exact: true,
                component: () => RouteComponents.ArticleSort
            },
            {
                path: Routes.newArticlePath(':userSlug', ':topicSlug', '(topics|shared-topics)', false),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.ArticleNew
            },
            {
                path: Routes.editArticlePath(':userSlug', ':articleSlug', false),
                exact: true,
                component: () => RouteComponents.ArticleEdit
            },
            {
                path: Routes.historyArticlePath(':userSlug', ':articleSlug', false),
                exact: true,
                component: () => RouteComponents.ArticleHistory
            },
            {
                path: Routes.userArticlePath(':userSlug', ':articleSlug', false),
                exact: true,
                component: () => RouteComponents.ArticleShow
            }
        ]
    },

    // Permanents is based on hash value in URL
    hashes: {
        search: [
            {
                path: Routes.searchParam,
                component: () => RouteComponents.SearchModule
            },
        ],
        topic: [
            {
                path: Routes.newTopicParam,
                component: () => RouteComponents.TopicPersistence
            },
            {
                path: Routes.shareTopicParam,
                component: () => RouteComponents.TopicShare
            },
            {
                path: Routes.sortTopicParam,
                component: () => RouteComponents.TopicSort
            }
        ],
        article: [
            {
                path: Routes.shareArticleParam,
                component: () => RouteComponents.ArticleShare
            },
            {
                path: Routes.trackingArticleParam,
                component: () => RouteComponents.ArticleTracking
            },
            {
                path: Routes.compareArticleParam,
                component: () => RouteComponents.ArticleCompare
            }
        ]
    }

    // Other routes are resolved by Rails router
};
