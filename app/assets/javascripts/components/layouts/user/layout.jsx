'use strict';

import {
    Suspense
} from 'react';

import {
    Routes,
    Route,
    Outlet
} from 'react-router-dom';

import withRouter from '../../modules/router';

import ErrorBoundary from '../../errors/boundary';

import RouteManager from '../managers/route';
import UserManager from '../managers/user';

import HeaderLayoutUser from './header';
import SidebarLayoutUser from './sidebar';
import FooterLayoutUser from './footer';


export default @withRouter({location: true})
class LayoutUser extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        hashRoutes: PropTypes.object.isRequired,
        staticContent: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object,
            PropTypes.string
        ]),
        currentUser: PropTypes.object,
        // from router
        routeLocation: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._initialRender = true;
    }

    componentDidMount() {
        this._initialRender = false;
    }

    _renderRouteChildren = (route, component, routeProperties) => {
        const Component = component();

        const {routes, currentUser, ...initProps} = this.props;

        const isHome = route.name === 'UserHome';

        return (
            <RouteManager routeProperties={routeProperties}>
                <UserManager initialCurrentUser={currentUser}>
                    <div className="layout-user-root">
                        <main className={classNames('layout-user-content', {
                            'layout-user-homeContent': isHome
                        })}>
                            <Suspense fallback={<div/>}>
                                <div className={isHome ? 'layout-user-homeLayout' : 'layout-user-layout'}>
                                    <Component initProps={this._initialRender ? initProps : undefined}
                                               staticContent={this.props.staticContent}/>
                                </div>
                            </Suspense>
                        </main>
                    </div>
                </UserManager>
            </RouteManager>
        );
    };

    _renderRoute = (route, path, index) => {
        if (!path) {
            throw new Error(`Path to render is null: ${JSON.stringify(route)}`);
        }

        const {component, ...routeProperties} = route;

        return (
            <Route key={path || index}
                   element={this._renderLayout(routeProperties)}>
                <Route path={path}
                       element={this._renderRouteChildren(route, component, routeProperties)}/>
            </Route>
        );
    };

    _renderHashRoutes = (hashRoutes) => {
        return hashRoutes.map((route) => {
            if (this.props.routeLocation.hash === `#${route.path}`) {
                const HashComponent = route.component();

                return (
                    <Suspense key={route.path}
                              fallback={<div/>}>
                        <ErrorBoundary errorType="notification">
                            <HashComponent/>
                        </ErrorBoundary>
                    </Suspense>
                );
            } else {
                return null;
            }
        });
    };

    _renderLayout = (routeProperties) => {
        return (
            <>
                <ErrorBoundary errorType="text"
                               errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                    <HeaderLayoutUser routeProperties={routeProperties}
                                      searchModule={this.props.hashRoutes.search[0]}/>
                </ErrorBoundary>

                <ErrorBoundary errorType="card">
                    <Outlet/>
                </ErrorBoundary>

                <ErrorBoundary errorType="card">
                    <SidebarLayoutUser routeProperties={routeProperties}/>
                </ErrorBoundary>

                <ErrorBoundary errorType="text"
                               errorTitle={I18n.t('js.helpers.errors.boundary.footer')}>
                    <FooterLayoutUser/>
                </ErrorBoundary>
            </>
        );
    };

    render() {
        return (
            <>
                <ErrorBoundary errorType="card">
                    <Routes>
                        {
                            this.props.routes.map((route, i) => (
                                Array.isArray(route.path) ? route.path.map((path) => this._renderRoute(route, path, i)) : this._renderRoute(route, route.path, i)
                            ))
                        }
                    </Routes>
                </ErrorBoundary>

                {this._renderHashRoutes(this.props.hashRoutes.topic)}
                {this._renderHashRoutes(this.props.hashRoutes.article)}
            </>
        );
    }
}
