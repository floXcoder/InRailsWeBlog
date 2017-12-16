'use strict';

import {
    Provider
} from 'react-redux';

import {
    BrowserRouter,
    Switch,
    Route,
    Link
} from 'react-router-dom';

import {
    configureStore
} from '../../stores';

import routes from '../../routes';

import DefaultLayout from '../layouts/default';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={configureStore}>
                <BrowserRouter>
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
                </BrowserRouter>
            </Provider>
        );
    }
}
