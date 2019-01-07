'use strict';

import {
    Suspense
} from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';

import {
    Provider
} from 'react-redux';

import {
    BrowserRouter
} from 'react-router-dom';

import {
    configureStore
} from '../../../stores';

import routes from '../../../routes';

import PasteManager from '../../modules/pasteManager';
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

                <Provider store={configureStore}>
                    <BrowserRouter>
                        <Suspense fallback={<div/>}>
                            <PasteManager>
                                <ScrollBackManager>
                                    <>
                                        <ErrorBoundary errorType="text"
                                                       errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                                            <HeaderLayoutHome permanentRoutes={routes.permanents.header}/>
                                        </ErrorBoundary>

                                        <ErrorBoundary errorType="card">
                                            <MainLayoutHome routes={routes.static.home}
                                                            permanentRoutes={routes.permanents.main}/>
                                        </ErrorBoundary>

                                        <ErrorBoundary errorType="text"
                                                       errorTitle={I18n.t('js.helpers.errors.boundary.footer')}>
                                            <FooterLayoutHome/>
                                        </ErrorBoundary>
                                    </>
                                </ScrollBackManager>
                            </PasteManager>
                        </Suspense>
                    </BrowserRouter>
                </Provider>
            </MuiThemeProvider>
        );
    }
}
