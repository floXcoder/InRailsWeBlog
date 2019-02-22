'use strict';

import {
    Provider,
    ReactReduxContext
} from 'react-redux';

import {
    BrowserRouter
} from 'react-router-dom';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
    configureStore
} from '../../../stores';

import routes from '../../../routes';

import PasteManager from '../../modules/pasteManager';
import ScrollBackManager from '../../modules/scrollBackManager';

import ErrorBoundary from '../../errors/boundary';

import HotkeyManager from '../../layouts/managers/hotkey';

import HeaderLayoutUser from '../../layouts/user/header';
import SidebarLayoutUser from '../../layouts/user/sidebar';
import MainLayoutUser from '../../layouts/user/main';
import FooterLayoutUser from '../../layouts/user/footer';

import theme from '../../../../jss/theme';

export default class ApplicationLayoutUser extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>

                <Provider store={configureStore}
                          context={ReactReduxContext}>
                    <BrowserRouter>
                        <PasteManager>
                            <ScrollBackManager>
                                <HotkeyManager>
                                    <>
                                        <ErrorBoundary errorType="text"
                                                       errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                                            <HeaderLayoutUser hashRoutes={routes.hashes}/>
                                        </ErrorBoundary>

                                        <ErrorBoundary errorType="card">
                                            <MainLayoutUser routes={routes.static.user}/>
                                        </ErrorBoundary>

                                        <ErrorBoundary errorType="card">
                                            <SidebarLayoutUser/>
                                        </ErrorBoundary>

                                        <ErrorBoundary errorType="text"
                                                       errorTitle={I18n.t('js.helpers.errors.boundary.footer')}>
                                            <FooterLayoutUser/>
                                        </ErrorBoundary>
                                    </>
                                </HotkeyManager>
                            </ScrollBackManager>
                        </PasteManager>
                    </BrowserRouter>
                </Provider>
            </MuiThemeProvider>
        );
    }
}
