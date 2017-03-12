'use strict';

import '../common';

import DefaultLayout from '../../components/layouts/default';
import HomePage from '../../components/home/home';

import ArticleIndex from '../../components/articles/index';

import ArticleNew from '../../components/articles/new';
import ArticleShow from '../../components/articles/show';
import ArticleEdit from '../../components/articles/edit';

// import TagShow from '../../components/tags/show';
// import TagEdit from '../../components/tags/edit';
//
// import UserShow from '../../components/users/show';
// import UserEdit from '../../components/users/edit';

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'

const browserHistory = createBrowserHistory();

const Home = ({}) => (
    <Router history={browserHistory}>
        <div>
            <DefaultLayout exact={true}
                           path="/"
                           component={HomePage} />

            <DefaultLayout path="/article/tags/:tagName"
                           component={ArticleIndex} />

            <DefaultLayout path="/article/user/:userId/topic/:topicId"
                           component={ArticleIndex} />

            <DefaultLayout path="/article/user/:userId"
                           component={ArticleIndex} />

            <DefaultLayout path="/article/new"
                           component={ArticleNew} />

            <DefaultLayout path="/article/:articleSlug"
                           component={ArticleShow} />

            <DefaultLayout path="/article/:articleSlug/edit"
                           component={ArticleEdit} />
        </div>
    </Router>
);

ReactDOM.render(
    <Home />,
    document.getElementById('home-component')
);
