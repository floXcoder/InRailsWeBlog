'use strict';

import {
    trackAction,
    trackMetrics
} from '../../../actions';

import withRouter from '../../modules/router';

export default @withRouter({location: true, params: true})
class RouteManager extends React.Component {
    static propTypes = {
        routeProperties: PropTypes.object.isRequired,
        // from router
        routeParams: PropTypes.object,
        routeLocation: PropTypes.object,
        children: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        trackAction(this.props.routeLocation, 'route');

        trackMetrics(this.props.routeLocation);
    }

    shouldComponentUpdate(nextProps) {
        // Called only when hash route change (search module, topic module, ...)

        // Update only if route, params or query string (ignore hash parameters) has changed
        const isHashQuery = typeof nextProps.routeLocation.state === 'string' ? nextProps.routeLocation.state.startsWith('#') : false;
        const updateRouter = JSON.stringify(this.props.routeProperties) !== JSON.stringify(nextProps.routeProperties) || JSON.stringify(this.props.routeParams) !== JSON.stringify(nextProps.routeParams) || (JSON.stringify(this.props.routeLocation.state) !== JSON.stringify(nextProps.routeLocation.state) && !isHashQuery);

        return updateRouter;
    }

    componentDidUpdate() {
        trackMetrics(this.props.routeLocation);
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
