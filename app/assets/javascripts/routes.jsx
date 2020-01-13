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
    // /terms_of_use
    // /errors/*
    // /404
    // /422
    // /500

    static: {
        home: [
            {
                path: Routes.rootPath(),
                exact: true,
                component: () => RouteComponents.HomeHome
            },
            {
                path: Routes.searchPath(),
                noTagSidebar: true,
                noHeaderSearch: true,
                component: () => RouteComponents.SearchIndex
            },
            // tag
            {
                path: Routes.showTagPath(':tagSlug'),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagShow
            },
            {
                path: Routes.tagsPath(),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagIndex
            },
            // tagged
            {
                path: Routes.taggedArticlesPath(':tagSlug', ':childTagSlug?'),
                exact: false,
                component: () => RouteComponents.ArticleIndex
            },
            // user: password
            {
                path: Routes.newPasswordPath(),
                exact: true,
                component: () => RouteComponents.UserPassword
            },
            {
                path: Routes.editPasswordPath(),
                exact: true,
                component: () => RouteComponents.UserPassword
            },
            // user: articles topic
            {
                path: Routes.topicArticlesPath(':userSlug', ':topicSlug'),
                exact: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user : tags topic
            {
                path: Routes.topicTagsPath(':userSlug', ':topicSlug'),
                exact: true,
                component: () => RouteComponents.TagIndex
            },
            // user: articles
            {
                path: Routes.userArticlesPath(':userSlug'),
                exact: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.userArticlePath(':userSlug', ':articleSlug'),
                exact: true,
                component: () => RouteComponents.ArticleShow
            },
            // articles: shared
            {
                path: Routes.sharedArticlePath(':articleSlug', ':publicLink'),
                exact: true,
                component: () => RouteComponents.ArticleShared
            },
            // Miscellaneous
            {
                path: Routes.notFoundPath(),
                component: () => NotFound
            },
            {
                component: () => NotFound
            }
        ],
        user: [
            {
                path: Routes.rootPath(),
                exact: true,
                tagCloud: true,
                component: () => RouteComponents.UserHome
            },
            // search
            {
                path: Routes.searchPath(),
                searchSidebar: true,
                noTagSidebar: true,
                noHeaderSearch: true,
                component: () => RouteComponents.SearchIndex
            },
            // tag
            {
                path: Routes.editTagPath(':tagSlug'),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagEdit
            },
            {
                path: Routes.sortTagPath(':tagSlug'),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TagSort
            },
            {
                path: Routes.showTagPath(':tagSlug'),
                exact: true,
                tagCloud: true,
                component: () => RouteComponents.TagShow
            },
            {
                path: Routes.tagsPath(),
                exact: true,
                tagCloud: true,
                component: () => RouteComponents.TagIndex
            },
            // tagged
            {
                path: Routes.taggedArticlesPath(':tagSlug', ':childTagSlug?'),
                exact: false,
                tagCloud: true,
                articleSidebar: true,
                // redirect: (route, previousRoute) => !route.tagCloud || !previousRoute.tagCloud,
                redirect: true,
                redirectPath: (params) => Routes.taggedTopicArticlesPath(params.userSlug, params.topicSlug, params.tagSlug, params.childTagSlug),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', ':tagSlug', ':childTagSlug?'),
                exact: false,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user: topics
            {
                path: Routes.userArticlesPath(':userSlug'),
                exact: true,
                redirect: true,
                redirectPath: () => Routes.rootPath()
            },
            {
                path: Routes.userTopicsPath(':userSlug'),
                exact: true,
                component: () => RouteComponents.UserHome
            },
            {
                path: Routes.userTopicPath(':userSlug', ':topicSlug'),
                exact: true,
                component: () => RouteComponents.TopicShow
            },
            {
                path: Routes.editTopicPath(':userSlug', ':topicSlug'),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TopicEdit
            },
            {
                path: Routes.editInventoriesTopicPath(':userSlug', ':topicSlug'),
                exact: true,
                noTagSidebar: true,
                component: () => RouteComponents.TopicEditInventories
            },
            {
                path: Routes.orderTopicArticlesPath(':userSlug', ':topicSlug', ':order', '(topics|shared-topics)'),
                exact: true,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.topicArticlesPath(':userSlug', ':topicSlug', '(topics|shared-topics)'),
                exact: true,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user : tags
            {
                path: Routes.topicTagsPath(':userSlug', ':topicSlug'),
                exact: true,
                component: () => RouteComponents.TagIndex
            },
            // user: articles
            {
                path: Routes.sortTopicArticlesPath(':userSlug', ':topicSlug'),
                exact: true,
                component: () => RouteComponents.ArticleSort
            },
            {
                path: Routes.newArticlePath(':userSlug', ':topicSlug', '(topics|shared-topics)'),
                exact: true,
                component: () => RouteComponents.ArticleNew
            },
            {
                path: Routes.editArticlePath(':userSlug', ':articleSlug'),
                exact: true,
                component: () => RouteComponents.ArticleEdit
            },
            {
                path: Routes.historyArticlePath(':userSlug', ':articleSlug'),
                exact: true,
                component: () => RouteComponents.ArticleHistory
            },
            {
                path: Routes.userArticlePath(':userSlug', ':articleSlug'),
                exact: true,
                component: () => RouteComponents.ArticleShow
            },
            // Redirection
            {
                path: Routes.newArticleRedirectPath(),
                redirect: true,
                redirectPath: (params) => Routes.newArticlePath(params.userSlug, params.topicSlug),
                component: () => RouteComponents.ArticleNew
            },

            // Miscellaneous
            {
                path: Routes.notFoundPath(),
                component: () => NotFound
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
            }
        ]
    }

    // Other routes are resolved by Rails router
    // Otherwise use Redirect from Router to always return an existing route
};
