// TODO
import {LazilyLoadFactory} from './loaders/hoc-loader';

const ArticleIndexLoader = LazilyLoadFactory(({ArticleIndex, ...props}) => <ArticleIndex {...props}/>, {
    ArticleIndex: () => import('./components/articles/index')
});
const ArticleShowLoader = LazilyLoadFactory(({ArticleShow, ...props}) => <ArticleShow {...props}/>, {
    ArticleShow: () => import('./components/articles/show')
});
const ArticleNewLoader = LazilyLoadFactory(({ArticleNew, ...props}) => <ArticleNew {...props}/>, {
    ArticleNew: () => import('./components/articles/new')
});
const ArticleEditLoader = LazilyLoadFactory(({ArticleEdit, ...props}) => <ArticleEdit {...props}/>, {
    ArticleEdit: () => import('./components/articles/edit')
});

const TagShowLoader = LazilyLoadFactory(({TagShow, ...props}) => <TagShow {...props}/>, {
    TagShow: () => import('./components/tags/show')
});
const TagEditLoader = LazilyLoadFactory(({TagEdit, ...props}) => <TagEdit {...props}/>, {
    TagEdit: () => import('./components/tags/edit')
});

const UserShowLoader = LazilyLoadFactory(({UserShow, ...props}) => <UserShow {...props}/>, {
    UserShow: () => import('./components/users/show')
});
const UserEditLoader = LazilyLoadFactory(({UserEdit, ...props}) => <UserEdit {...props}/>, {
    UserEdit: () => import('./components/users/edit')
});

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
