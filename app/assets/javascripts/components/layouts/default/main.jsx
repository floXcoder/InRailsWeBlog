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

import RouteManager from '../managers/route';

import styles from '../../../../jss/default/main';

export default @withStyles(styles)
class MainLayoutDefault extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        staticContent: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object,
            PropTypes.string
        ]),
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

                                   const {routes, classes, ...initProps} = this.props;

                                   const isHome = route.name === 'Home';

                                   return (
                                       <RouteManager currentRoute={routeProperties}
                                                     params={router.match.params}
                                                     location={router.location}>
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
                                       </RouteManager>
                                   );
                               }}/>
                    ))
                }
            </Switch>
        );
    }
}
