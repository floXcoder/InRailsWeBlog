'use strict';

import '../../../stylesheets/pages/home/home.scss';

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

import MainLayout from '../layouts/main';

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
                                <MainLayout key={index}
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
