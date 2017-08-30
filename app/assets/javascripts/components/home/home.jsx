'use strict';

import {
    Provider
} from 'react-redux';

import {
    Switch,
    Route,
    Link
} from 'react-router-dom';

import {
    ConnectedRouter
} from 'react-router-redux';

import routes from '../../routes';

// import UserStore from '../../stores/userStore';

import {
    configureStore, browserHistory
} from '../../stores/index';

import DefaultLayout from '../layouts/default';

export default class HomePage extends React.Component {
    static propTypes = {
        location: PropTypes.object,
        children: PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    constructor(props) {
        super(props);

        // TODO: cannot use push with browser history
        // browserHistory.replace(`/topic/${$app.getCurrentTopic().slug}`);
    }

    render() {
        return (
            <Provider store={configureStore}>
                <ConnectedRouter history={browserHistory}>
                    <Switch>
                        {
                            routes.home.views.map((route, index) => (
                                <DefaultLayout key={index}
                                               routes={routes}
                                               path={route.path}
                                               exact={route.exact}
                                               component={route.component}/>
                            ))
                        }
                    </Switch>
                </ConnectedRouter>
            </Provider>
        );
    }
}
