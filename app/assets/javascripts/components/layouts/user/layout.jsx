import React, {
    Suspense
} from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import {
    Routes,
    Route,
    Outlet
} from 'react-router';

import withRouter from '@js/components/modules/router';

import ErrorBoundary from '@js/components/errors/boundary';

import RouteManager from '@js/components/layouts/managers/route';
import UserManager from '@js/components/layouts/managers/user';

import HeaderLayoutUser from '@js/components/layouts/user/header';
import SidebarLayoutUser from '@js/components/layouts/user/sidebar';
import FooterLayoutUser from '@js/components/layouts/user/footer';

import I18n from '@js/modules/translations';


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

        const {
            routes,
            currentUser,
            ...initProps
        } = this.props;

        const isHome = route.name === 'UserHome';

        return (
            <RouteManager routeProperties={routeProperties}>
                <UserManager initialCurrentUser={currentUser}>
                    <div className="layout-user-root">
                        <main className={classNames('layout-user-content', {
                            'layout-user-home-content': isHome
                        })}>
                            <Suspense fallback={<div/>}>
                                <div className={isHome ? 'layout-user-home-layout' : 'layout-user-layout'}>
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

    _renderRoute = (route, path, i) => {
        if (!path) {
            throw new Error(`Path to render is null: ${JSON.stringify(route)}`);
        }

        const {
            component,
            index,
            ...routeProperties
        } = route;

        return (
            <Route key={path || i}
                   element={this._renderLayout(routeProperties)}>
                <Route path={path}
                       index={index}
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

export default withRouter({location: true})(LayoutUser);