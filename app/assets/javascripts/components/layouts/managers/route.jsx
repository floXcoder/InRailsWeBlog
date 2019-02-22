'use strict';

import _ from 'lodash';

import {
    routeChange
} from '../../../actions';

export default @connect(null, {
    routeChange
})
class RouteManager extends React.Component {
    static propTypes = {
        currentRoute: PropTypes.object.isRequired,
        params: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        children: PropTypes.object.isRequired,
        // from connect
        routeChange: PropTypes.func
    };

    static defaultProps = {
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.routeChange(this.props.currentRoute, this.props.params, this.props.location);
    }

    shouldComponentUpdate(nextProps) {
        // Update only if route, params or query string (ignore hash parameters) has changed
        const updateRouter = !_.isEqual(this.props.currentRoute, nextProps.currentRoute) || !_.isEqual(this.props.params, nextProps.params) || (!_.isEqual(this.props.location.state, nextProps.location.state) && !nextProps.location.state.startsWith('#'));

        if(!updateRouter) {
            this.props.routeChange(nextProps.currentRoute, nextProps.params, nextProps.location);
        }

        return updateRouter;
    }

    componentDidUpdate() {
        this.props.routeChange(this.props.currentRoute, this.props.params, this.props.location);
    }

    render() {
        return React.Children.only(this.props.children);
    }
}
