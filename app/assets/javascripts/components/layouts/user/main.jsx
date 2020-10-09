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

import styles from '../../../../jss/user/main';

export default @withStyles(styles)
class MainLayoutUser extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        staticContent: PropTypes.string,
        currentUser: PropTypes.object,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._initialRender = true;
    }

    componentDidMount() {
        this._initialRender = false;
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <Switch>
                {
                    this.props.routes.map((route, i) => (
                        <Route key={Array.isArray(route.path) ? route.path.join('-') : (route.path || i)}
                               path={route.path}
                               exact={route.exact}
                               strict={route.strict}
                               render={(router) => {
                                   if (route.status && router.staticContext) {
                                       router.staticContext.status = route.status;
                                   }

                                   const {component, ...routeProperties} = route;
                                   const Component = component();

                                   const {routes, currentUser, classes, ...initProps} = this.props;

                                   const isHome = route.name === 'UserHome';

                                   return (
                                       <RouteManager currentRoute={routeProperties}
                                                     params={router.match.params}
                                                     location={router.location}>
                                           <UserManager routeParams={router.match.params}
                                                        routeState={router.location.state}
                                                        pushHistory={router.history.push}
                                                        initialCurrentUser={currentUser}>
                                               <div className={classes.root}>
                                                   <main className={classNames(classes.content, {
                                                       [classes.homeContent]: isHome
                                                   })}>
                                                       <Suspense fallback={<div/>}>
                                                           <div className={isHome ? classes.homeLayout : classes.layout}>
                                                               <Component routeParams={router.match.params}
                                                                          routeHash={router.location.search}
                                                                          routeState={router.location.state}
                                                                          staticContent={this.props.staticContent}
                                                                          initProps={this._initialRender ? initProps : undefined}/>
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
