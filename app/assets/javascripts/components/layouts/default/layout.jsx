import React, {
    Suspense
} from 'react';
import PropTypes from 'prop-types';

import {
    Routes,
    Route,
    Outlet
} from 'react-router';

import classNames from 'classnames';

import I18n from '@js/modules/translations';

import withRouter from '@js/components/modules/router';

import ErrorBoundary from '@js/components/errors/boundary';

import RouteManager from '@js/components/layouts/managers/route';

import HeaderLayoutDefault from '@js/components/layouts/default/header';
import FooterLayoutDefault from '@js/components/layouts/default/footer';


class LayoutDefault extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        hashRoutes: PropTypes.object.isRequired,
        staticContent: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object,
            PropTypes.string
        ]),
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

    shouldComponentUpdate() {
        return false;
    }

    _renderRouteChildren = (route, component, routeProperties) => {
        const Component = component();

        const {
            routes,
            ...initProps
        } = this.props;

        const isHome = route.name === 'Home';

        return (
            <RouteManager routeProperties={routeProperties}>
                <main className={classNames('layout-default-content', {
                    'layout-default-home-content': isHome
                })}>
                    <Suspense fallback={<div/>}>
                        <div className={isHome ? 'layout-default-home-layout' : 'layout-default-layout'}>
                            <Component initProps={this._initialRender ? initProps : undefined}
                                       staticContent={this.props.staticContent}/>
                        </div>
                    </Suspense>
                </main>
            </RouteManager>
        );
    };

    _renderRoute = (route, path, index) => {
        if (!path) {
            throw new Error(`Path to render is null: ${JSON.stringify(route)}`);
        }

        const {
            component,
            ...routeProperties
        } = route;

        return (
            <Route key={path || index}
                   element={this._renderLayout(routeProperties)}>
                <Route path={path}
                       element={this._renderRouteChildren(route, component, routeProperties)}/>
            </Route>
        );
    };

    _renderLayout = (routeProperties) => {
        return (
            <>
                <ErrorBoundary errorType="text"
                               errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                    <HeaderLayoutDefault routeProperties={routeProperties}
                                         searchModule={this.props.hashRoutes.search[0]}/>
                </ErrorBoundary>

                <ErrorBoundary errorType="card">
                    <Outlet/>
                </ErrorBoundary>

                <ErrorBoundary errorType="text"
                               errorTitle={I18n.t('js.helpers.errors.boundary.footer')}>
                    <FooterLayoutDefault/>
                </ErrorBoundary>
            </>
        );
    };

    render() {
        return (
            <ErrorBoundary errorType="card">
                <Routes>
                    {
                        this.props.routes.map((route, i) => (
                            Array.isArray(route.path) ? route.path.map((path) => this._renderRoute(route, path, i)) : this._renderRoute(route, route.path, i)
                        ))
                    }
                </Routes>
            </ErrorBoundary>
        );
    }
}

export default withRouter({location: true})(LayoutDefault);