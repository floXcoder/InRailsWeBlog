'use strict';

import {
    Provider,
    ReactReduxContext
} from 'react-redux';

import {
    Router
} from 'react-router-dom';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
    configureStore
} from '../../../stores';

import routes from '../../../routes';

import browserHistory from '../../modules/browserHistory';
import ScrollBackManager from '../../modules/scrollBackManager';

import ErrorBoundary from '../../errors/boundary';

import HeaderLayoutHome from '../../layouts/home/header';
import MainLayoutHome from '../../layouts/home/main';
import FooterLayoutHome from '../../layouts/home/footer';

import theme from '../../../../jss/theme';

export default class ApplicationLayoutHome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>

                <Provider store={configureStore}
                          context={ReactReduxContext}>
                    <Router history={browserHistory}>
                        <ScrollBackManager>
                            <>
                                <ErrorBoundary errorType="text"
                                               errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                                    <HeaderLayoutHome hashRoutes={routes.hashes}/>
                                </ErrorBoundary>

                                <ErrorBoundary errorType="card">
                                    <MainLayoutHome routes={routes.static.home}/>
                                </ErrorBoundary>

                                <ErrorBoundary errorType="text"
                                               errorTitle={I18n.t('js.helpers.errors.boundary.footer')}>
                                    <FooterLayoutHome/>
                                </ErrorBoundary>
                            </>
                        </ScrollBackManager>
                    </Router>
                </Provider>
            </MuiThemeProvider>
        );
    }
}
