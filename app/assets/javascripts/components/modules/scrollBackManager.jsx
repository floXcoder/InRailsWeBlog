'use strict';

import {
    withRouter
} from 'react-router-dom';

@withRouter
export default class ScrollBackManager extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        // From router
        location: PropTypes.object,
        history: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._positionByRoutes = {};
    }

    getSnapshotBeforeUpdate(prevProps) {
        // if the route changes
        if (this.props.location !== prevProps.location) {
            const doc = document.documentElement;
            const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

            // store the current route's position
            this._positionByRoutes[prevProps.location.pathname] = [left, top];
        }

        return null;
    }

    componentDidUpdate(prevProps) {
        // if the route changes
        if (this.props.location !== prevProps.location) {
            // Wait for loading dynamic elements
            setTimeout(() => {
                // recover the new route's position if already stored
                if (this._positionByRoutes[this.props.location.pathname]) { // already stored
                    window.scrollTo(this._positionByRoutes[this.props.location.pathname][0] || 0, this._positionByRoutes[this.props.location.pathname][1] || 0);
                }
                else { // first time
                    window.scrollTo(0, 0);
                }
            }, 500);
        }
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
