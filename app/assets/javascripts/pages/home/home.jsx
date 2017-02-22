'use strict';

require('../common');

const HomePage = require('../../components/home/home');

const ArticleNew = require('../../components/articles/new');
const ArticleIndex = require('../../components/articles/index');
const ArticleShow = require('../../components/articles/show');
const ArticleEdit = require('../../components/articles/edit');

const TagShow = require('../../components/tags/show');
const TagEdit = require('../../components/tags/edit');

const UserShow = require('../../components/users/show');
const UserEdit = require('../../components/users/edit');

import {Router, Route, IndexRoute, browserHistory} from 'react-router';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/"
               component={HomePage}>

            <IndexRoute component={ArticleIndex}/>

            <Route path="article">
                <IndexRoute component={ArticleIndex} />

                <Route path="tags/:tagName"
                       component={ArticleIndex}/>

                <Route path="user/:userId/topic/:topicId"
                       component={ArticleIndex}/>

                <Route path="user/:userId/:type"
                       component={ArticleIndex}/>

                <Route path="user/:userId"
                       component={ArticleIndex}/>

                <Route path="new"
                       component={ArticleNew}/>

                <Route path=":articleSlug/edit"
                       component={ArticleEdit}/>

                <Route path=":articleSlug"
                       component={ArticleShow}/>
            </Route>

            <Route path="tag">
                <Route path=":tagId/edit"
                       component={TagEdit}/>

                <Route path=":tagId"
                       component={TagShow}/>
            </Route>

            <Route path="user">
                <Route path="profile/:userPseudo/edit"
                       component={UserEdit}/>

                <Route path="profile/:userPseudo"
                       component={UserShow}/>
            </Route>
        </Route>
    </Router>
, document.getElementById('app-component'));
