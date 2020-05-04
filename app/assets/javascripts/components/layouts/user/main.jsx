'use strict';

import {
    Suspense
} from 'react';

import {
    Switch,
    Route
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';

import RouteManager from '../../layouts/managers/route';
import UserManager from '../../layouts/managers/user';

import RedirectLayout from './redirect';

import styles from '../../../../jss/user/main';

export default @withStyles(styles)
class MainLayoutUser extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        // In development environment with hot reload:
        // React Suspense or Memo use context that cause a re-render without calling shouldComponentUpdate
        // So some route (like ArticleIndex) are called 4 times!

        return (
            <Switch>
                {
                    this.props.routes.map((route, i) => (
                        <Route key={Array.isArray(route.path) ? route.path.join('-') : (route.path || i)}
                               path={route.path}
                               exact={route.exact}
                               strict={route.strict}
                               render={(router) => {
                                   if (route.redirect) {
                                       return (
                                           <RedirectLayout redirectPath={route.redirectPath}
                                                           routeState={router.location.state}
                                                           {...router.match.params}/>
                                       );
                                   } else if (route.status && router.staticContext) {
                                       router.staticContext.status = route.status;
                                   }

                                   const {component, ...routeProperties} = route;
                                   const Component = component();

                                   return (
                                       <RouteManager currentRoute={routeProperties}
                                                     params={router.match.params}
                                                     location={router.location}>
                                           <UserManager routeParams={router.match.params}
                                                        routeState={router.location.state}
                                                        pushHistory={router.history.push}>
                                               <div className={this.props.classes.root}>
                                                   <main className={this.props.classes.content}>
                                                       <Suspense fallback={<div/>}>
                                                           <div className={this.props.classes.component}>
                                                               <Component routeParams={router.match.params}
                                                                          routeHash={router.location.search}
                                                                          routeState={router.location.state}/>
                                                           </div>
                                                       </Suspense>
                                                   </main>
                                               </div>
                                           </UserManager>
                                       </RouteManager>
                                   );
                               }}/>
                    ))
                }
            </Switch>
        );
    }
}
