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
                noTagSidebar: true,
                component: () => RouteComponents.About
            },
            {
                path: Routes.terms(false),
                noTagSidebar: true,
                component: () => RouteComponents.Terms
            },
            {
                path: Routes.privacy(false),
                noTagSidebar: true,
                component: () => RouteComponents.Privacy
            },
            // User account
            {
                path: Routes.userConfirmationPath(false),
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
                path: '*',
                status: 404,
                component: () => NotFound
            }
        ],
        home: [
            {
                path: Routes.rootPath(false),
                name: 'Home',
                component: () => RouteComponents.Home
            },
            {
                path: Routes.searchPath(false),
                noTagSidebar: true,
                noHeaderSearch: true,
                component: () => RouteComponents.SearchIndex
            },
            // tag
            {
                path: Routes.showTagPath(':tagSlug', false),
                noTagSidebar: true,
                component: () => RouteComponents.TagShow
            },
            {
                path: Routes.tagsPath(false),
                noTagSidebar: true,
                component: () => RouteComponents.TagIndex
            },
            // tagged
            {
                path: Routes.taggedArticlesPath(':tagSlug', undefined, false),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedArticlesPath(':tagSlug', ':childTagSlug', false),
                component: () => RouteComponents.ArticleIndex
            },
            // tagged
            {
                path: Routes.taggedArticlesPath(':tagSlug', undefined, false),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedArticlesPath(':tagSlug', ':childTagSlug', false),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', undefined, 'topics', false),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', ':childTagSlug', 'topics', false),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', undefined, 'shared-topics', false),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', ':childTagSlug', 'shared-topics', false),
                component: () => RouteComponents.ArticleIndex
            },
            // user: password
            {
                path: Routes.newPasswordPath(false),
                component: () => RouteComponents.UserPassword
            },
            {
                path: Routes.editPasswordPath(false),
                component: () => RouteComponents.UserPassword
            },
            // user: articles topic
            {
                path: Routes.topicArticlesPath(':userSlug', ':topicSlug', 'topics', false),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.topicArticlesPath(':userSlug', ':topicSlug', 'shared-topics', false),
                component: () => RouteComponents.ArticleIndex
            },
            // user : tags topic
            {
                path: Routes.topicTagsPath(':userSlug', ':topicSlug', false),
                component: () => RouteComponents.TagIndex
            },
            // user : topics
            {
                path: Routes.userTopicPath(':userSlug', ':topicSlug', false),
                component: () => RouteComponents.TopicShow
            },
            // user: articles
            {
                path: Routes.userArticlesPath(':userSlug', false),
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.userArticlePath(':userSlug', ':articleSlug', false),
                component: () => RouteComponents.ArticleShow
            },
            // articles: shared
            {
                path: Routes.sharedArticlePath(':articleSlug', ':publicLink', false),
                component: () => RouteComponents.ArticleShared
            }
        ],
        user: [
            {
                path: Routes.rootPath(false),
                name: 'UserHome',
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
                noTagSidebar: true,
                component: () => RouteComponents.TagEdit
            },
            {
                path: Routes.sortTagPath(':userSlug', false),
                noTagSidebar: true,
                component: () => RouteComponents.TagSort
            },
            {
                path: Routes.showTagPath(':tagSlug', false),
                tagCloud: true,
                component: () => RouteComponents.TagShow
            },
            {
                path: Routes.tagsPath(false),
                tagCloud: true,
                component: () => RouteComponents.TagIndex
            },
            // tagged
            {
                path: Routes.taggedArticlesPath(':tagSlug', undefined, false),
                tagCloud: true,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedArticlesPath(':tagSlug', ':childTagSlug', false),
                tagCloud: true,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', undefined, 'topics', false),
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', ':childTagSlug', 'topics', false),
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', undefined, 'shared-topics', false),
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.taggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', ':childTagSlug', 'shared-topics', false),
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user: topics
            {
                path: Routes.userHomePath(':userSlug', false),
                tagCloud: true,
                component: () => RouteComponents.UserHome
            },
            {
                path: Routes.userTopicsPath(':userSlug', false),
                component: () => RouteComponents.UserHome
            },
            {
                path: Routes.userTopicPath(':userSlug', ':topicSlug', false),
                component: () => RouteComponents.TopicShow
            },
            {
                path: Routes.editTopicPath(':userSlug', ':topicSlug', false),
                noTagSidebar: true,
                component: () => RouteComponents.TopicEdit
            },
            {
                path: Routes.editInventoriesTopicPath(':userSlug', ':topicSlug', false),
                noTagSidebar: true,
                component: () => RouteComponents.TopicEditInventories
            },
            {
                path: Routes.orderTopicArticlesPath(':userSlug', ':topicSlug', ':order', 'topics', false),
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.orderTopicArticlesPath(':userSlug', ':topicSlug', ':order', 'shared-topics', false),
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.orderTaggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', ':order', 'topics', false),
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.orderTaggedTopicArticlesPath(':userSlug', ':topicSlug', ':tagSlug', ':order', 'shared-topics', false),
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.topicArticlesPath(':userSlug', ':topicSlug', 'topics', false),
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.topicArticlesPath(':userSlug', ':topicSlug', 'shared-topics', false),
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            // user : tags
            {
                path: Routes.topicTagsPath(':userSlug', ':topicSlug', false),
                component: () => RouteComponents.TagIndex
            },
            // user: articles
            {
                path: Routes.userArticlesPath(':userSlug', false),
                noTagSidebar: true,
                articleSidebar: true,
                component: () => RouteComponents.ArticleIndex
            },
            {
                path: Routes.sortTopicArticlesPath(':userSlug', ':topicSlug', false),
                component: () => RouteComponents.ArticleSort
            },
            {
                path: Routes.newArticlePath(':userSlug', ':topicSlug', 'topics', false),
                noTagSidebar: true,
                component: () => RouteComponents.ArticleNew
            },
            {
                path: Routes.newArticlePath(':userSlug', ':topicSlug', 'shared-topics', false),
                noTagSidebar: true,
                component: () => RouteComponents.ArticleNew
            },
            {
                path: Routes.editArticlePath(':userSlug', ':articleSlug', false),
                component: () => RouteComponents.ArticleEdit
            },
            {
                path: Routes.historyArticlePath(':userSlug', ':articleSlug', false),
                component: () => RouteComponents.ArticleHistory
            },
            {
                path: Routes.userArticlePath(':userSlug', ':articleSlug', false),
                component: () => RouteComponents.ArticleShow
            },
            // articles: shared
            {
                path: Routes.sharedArticlePath(':articleSlug', ':publicLink', false),
                component: () => RouteComponents.ArticleShared
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
