'use strict';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
    Provider,
    ReactReduxContext
} from 'react-redux';

import {
    Router
} from 'react-router-dom';

import {
    HelmetProvider
} from 'react-helmet-async';

import {
    configureStore
} from '../../../stores';

import routes from '../../../routes';

import browserHistory from '../../modules/browserHistory';
import PasteManager from '../../modules/pasteManager';
import ScrollBackManager from '../../modules/scrollBackManager';

import ErrorBoundary from '../../errors/boundary';

import HotkeyManager from '../managers/hotkey';

import HeaderLayoutUser from './header';
import SidebarLayoutUser from './sidebar';
import MainLayoutUser from './main';
import FooterLayoutUser from './footer';

import theme from '../../../../jss/theme';

export default class ApplicationLayoutUser extends React.Component {
    static propTypes = {
        staticContent: PropTypes.string
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>

                <Provider store={configureStore}
                          context={ReactReduxContext}>
                    <HelmetProvider>
                        <Router history={browserHistory}>
                            <PasteManager>
                                <ScrollBackManager>
                                    <HotkeyManager>
                                        <>
                                            <ErrorBoundary errorType="text"
                                                           errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                                                <HeaderLayoutUser hashRoutes={routes.hashes}/>
                                            </ErrorBoundary>

                                            <ErrorBoundary errorType="card">
                                                <MainLayoutUser routes={[...routes.static.common, ...routes.static.user, ...routes.static.notFound]}
                                                                staticContent={this.props.staticContent}
                                                                {...this.props}/>
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
                        </Router>
                    </HelmetProvider>
                </Provider>
            </MuiThemeProvider>
        );
    }
}
