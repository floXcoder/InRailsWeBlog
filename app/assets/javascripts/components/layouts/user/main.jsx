'use strict';

import {
    Suspense
} from 'react';

import {
    Switch,
    Route,
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import UserManager from '../../layouts/managers/user';

import ErrorBoundary from '../../errors/boundary';

import RedirectLayout from './redirect';
import TagSidebarLayout from './tagSidebar';
import ArticleSidebarLayout from './articleSidebar';
import BreadcrumbLayout from '../breadcrumb';

import styles from '../../../../jss/user/main';

export default @withStyles(styles)

class MainLayoutUser extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        permanentRoutes: PropTypes.array.isRequired,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._previousRoute = {};
    }

    _renderPermanentRoutes = (routes) => {
        return routes.map((route, index) => (
            <Route key={index}
                   children={({match, location, history}) => {
                       const Component = route.component();

                       return (
                           <div>
                               {
                                   location.hash === `#${route.path}` &&
                                   <Component params={match.params}
                                              history={history}
                                              initialData={location.state}/>
                               }
                           </div>
                       );
                   }}/>
        ));
    };

    render() {
        return (
            <Switch>
                {
                    this.props.routes.map((route) => {
                        return (
                            <Route key={route.path}
                                   path={route.path}
                                   exact={route.exact}
                                   render={(router) => {
                                       if (route.redirect && route.redirect(route, this._previousRoute)) {
                                           return (
                                               <RedirectLayout redirectPath={route.redirectPath}
                                                               {...router.match.params}/>
                                           );
                                       }

                                       this._previousRoute = route;

                                       const Component = route.component();

                                       return (
                                           <UserManager params={router.match.params}
                                                        initialData={router.location.state}>
                                               <div className={this.props.classes.root}>
                                                   <Hidden smDown={true}>
                                                       <ErrorBoundary errorType="text"
                                                                      errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                                                           <div className={this.props.classes.sidebar}>
                                                               <TagSidebarLayout params={router.match.params}
                                                                                 isCloud={route.tagCloud}/>
                                                           </div>
                                                       </ErrorBoundary>
                                                   </Hidden>

                                                   {
                                                       route.articleSidebar &&
                                                       <Hidden smDown={true}>
                                                           <ErrorBoundary errorType="text"
                                                                          errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                                                               <div className={this.props.classes.sidebar}>
                                                                   <ArticleSidebarLayout/>
                                                               </div>
                                                           </ErrorBoundary>
                                                       </Hidden>
                                                   }

                                                   <main className={this.props.classes.content}>
                                                       {
                                                           route.noBreadcrumb &&
                                                           <ErrorBoundary errorType="text"
                                                                          errorTitle={I18n.t('js.helpers.errors.boundary.title')}>
                                                               <div className={this.props.classes.breadcrumb}>
                                                                   <BreadcrumbLayout
                                                                       currentPath={router.location.pathname}
                                                                       recentsLimit={8}/>
                                                               </div>
                                                           </ErrorBoundary>
                                                       }

                                                       <Suspense fallback={<div/>}>
                                                           <div className={this.props.classes.component}>
                                                               {
                                                                   this._renderPermanentRoutes(this.props.permanentRoutes)
                                                               }

                                                               <Component params={router.match.params}
                                                                          queryString={router.location.search}
                                                                          history={router.history}
                                                                          initialData={router.location.state}/>
                                                           </div>
                                                       </Suspense>

                                                       {
                                                           (router.match.params.tagSlug || router.match.params.parentTagSlug || router.match.params.childTagSlug) &&
                                                           <Link className={this.props.classes.quickAdd}
                                                                 to={{
                                                                     hash: '#new-article',
                                                                     state: {
                                                                         // mode: 'note',
                                                                         parentTagSlug: router.match.params.parentTagSlug || router.match.params.tagSlug,
                                                                         childTagSlug: router.match.params.childTagSlug
                                                                     }
                                                                 }}>
                                                               <AddCircleOutlineIcon
                                                                   className={this.props.classes.quickAddIcon}/>
                                                           </Link>
                                                       }
                                                   </main>
                                               </div>
                                           </UserManager>
                                       );
                                   }}/>
                        );
                    })
                }
            </Switch>
        );
    }
}
