import React from 'react';
import PropTypes from 'prop-types';

import {
    ThemeProvider,
    StyledEngineProvider
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {
    Provider,
    ReactReduxContext
} from 'react-redux';

import {
    BrowserRouter
} from 'react-router';

import {
    HelmetProvider
} from 'react-helmet-async';

import {
    configureStore
} from '@js/stores';

import {
    extractDataFromElement
} from '@js/middlewares/json';

import theme from '@js/theme';

import routes from '@js/routes';

import PasteManager from '@js/components/modules/pasteManager';
import ScrollBackManager from '@js/components/modules/scrollBackManager';

import HotkeyManager from '@js/components/layouts/managers/hotkey';

import LayoutUser from '@js/components/layouts/user/layout';


export default class ApplicationLayoutUser extends React.Component {
    static propTypes = {
        componentId: PropTypes.string,
        staticContent: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.object,
            PropTypes.string
        ])
    };

    constructor(props) {
        super(props);
    }

    _componentProps = () => {
        return {
            staticContent: this.props.staticContent,
            ...extractDataFromElement(this.props.componentId, !window.currentAdminId)
        };
    };

    render() {
        return (
            <StyledEngineProvider injectFirst={true}>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>

                    <Provider store={configureStore}
                              context={ReactReduxContext}>
                        <HelmetProvider>
                            <BrowserRouter>
                                <PasteManager>
                                    <ScrollBackManager>
                                        <HotkeyManager>
                                            <LayoutUser
                                                routes={[...routes.static.common, ...routes.static.user, ...routes.static.notFound]}
                                                hashRoutes={routes.hashes}
                                                {...this._componentProps()}/>
                                        </HotkeyManager>
                                    </ScrollBackManager>
                                </PasteManager>
                            </BrowserRouter>
                        </HelmetProvider>
                    </Provider>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}
