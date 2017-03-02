'use strict';

import '../common';

import HomePage from '../../components/home/home';

import ArticleNew from '../../components/articles/new';
import ArticleIndex from '../../components/articles/index';
import ArticleShow from '../../components/articles/show';
import ArticleEdit from '../../components/articles/edit';

import TagShow from '../../components/tags/show';
import TagEdit from '../../components/tags/edit';

import UserShow from '../../components/users/show';
import UserEdit from '../../components/users/edit';

import {Router, Route, IndexRoute, browserHistory} from 'react-router';

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/"
               component={HomePage}>

            <IndexRoute component={ArticleIndex}/>

            <Route path="article">
                <IndexRoute component={ArticleIndex}/>

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
