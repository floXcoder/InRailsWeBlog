import {LazilyLoadFactory} from './loaders/hoc-loader';

// TODO: use loader when code is operational
// const ArticleIndexLoader = LazilyLoadFactory(({ArticleIndex, ...props}) => <ArticleIndex {...props}/>, {
//     ArticleIndex: () => import('./components/articles/index')
// });
// const ArticleShowLoader = LazilyLoadFactory(({ArticleShow, ...props}) => <ArticleShow {...props}/>, {
//     ArticleShow: () => import('./components/articles/show')
// });
// const ArticleNewLoader = LazilyLoadFactory(({ArticleNew, ...props}) => <ArticleNew {...props}/>, {
//     ArticleNew: () => import('./components/articles/new')
// });
// const ArticleEditLoader = LazilyLoadFactory(({ArticleEdit, ...props}) => <ArticleEdit {...props}/>, {
//     ArticleEdit: () => import('./components/articles/edit')
// });

// const TagShowLoader = LazilyLoadFactory(({TagShow, ...props}) => <TagShow {...props}/>, {
//     TagShow: () => import('./components/tags/show')
// });
// const TagEditLoader = LazilyLoadFactory(({TagEdit, ...props}) => <TagEdit {...props}/>, {
//     TagEdit: () => import('./components/tags/edit')
// });
//
// const UserShowLoader = LazilyLoadFactory(({UserShow, ...props}) => <UserShow {...props}/>, {
//     UserShow: () => import('./components/users/show')
// });
// const UserEditLoader = LazilyLoadFactory(({UserEdit, ...props}) => <UserEdit {...props}/>, {
//     UserEdit: () => import('./components/users/edit')
// });

import ArticleIndex from './components/articles/index';
import ArticleNew from './components/articles/new';
import ArticleShow from './components/articles/show';
import ArticleEdit from './components/articles/edit';

export default {
    init: {
        path: '/',
        exact: true
    },

    home: {
        mainView: [
            {
                path: '/',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/topic/:topicSlug',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/topic/:topicSlug/tags/:tagSlug',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/topic/:topicSlug/tags/:tagParentSlug/:tagChildSlug',
                exact: true,
                component: ArticleIndex
            },
            {
                path: '/topic/:topicSlug/user/:userSlug',
                component: ArticleIndex
            },
            {
                path: '/topic/:topicSlug/article/new',
                exact: true,
                component: ArticleNew
            },
            {
                path: '/topic/:topicSlug/article/:articleSlug',
                component: ArticleShow
            },
            {
                path: '/topic/:topicSlug/article/:articleSlug/edit',
                component: ArticleEdit
            }
        ]
    }
};
