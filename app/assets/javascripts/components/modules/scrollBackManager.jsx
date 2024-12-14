import React from 'react';
import PropTypes from 'prop-types';

import withRouter from '@js/components/modules/router';


class ScrollBackManager extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        // from router
        routeLocation: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._positionByRoutes = {};

        this._scrollTimeout = null;
    }

    getSnapshotBeforeUpdate(prevProps) {
        // if the route changes
        if (this.props.routeLocation !== prevProps.routeLocation) {
            const doc = document.documentElement;
            const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

            // store the current route's position
            this._positionByRoutes[prevProps.routeLocation.pathname] = [left, top];
        }

        return null;
    }

    componentDidUpdate(prevProps) {
        if (window.seoMode) {
            return;
        }

        // if the route changes
        if (this.props.routeLocation !== prevProps.routeLocation) {
            // Wait for loading dynamic elements
            this._scrollTimeout = setTimeout(() => {
                // recover the new route's position if already stored
                if (this._positionByRoutes[this.props.routeLocation.pathname]) {
                    // already stored
                    window.scrollTo(this._positionByRoutes[this.props.routeLocation.pathname][0] || 0, this._positionByRoutes[this.props.routeLocation.pathname][1] || 0);
                } else {
                    // first time
                    window.scrollTo(0, 0);
                }
            }, 50);
        }
    }

    componentWillUnmount() {
        if (this._scrollTimeout) {
            clearTimeout(this._scrollTimeout);
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}

export default withRouter({location: true})(ScrollBackManager);