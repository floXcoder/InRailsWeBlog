'use strict';

import {
    ThemeProvider,
    StyledEngineProvider
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import {
    CacheProvider
} from '@emotion/react';

import {
    Provider,
    ReactReduxContext
} from 'react-redux';

import {
    BrowserRouter
} from 'react-router-dom';

import {
    HelmetProvider
} from 'react-helmet-async';

import {
    configureStore
} from '../../../stores';

import {
    extractDataFromElement
} from '../../../middlewares/json';

import emotionCache from '../../../modules/emotionCache';

import theme from '../../../theme';

import routes from '../../../routes';

import ScrollBackManager from '../../modules/scrollBackManager';

import LayoutDefault from './layout';


export default class ApplicationLayoutDefault extends React.Component {
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
                <CacheProvider value={emotionCache()}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>

                        <Provider store={configureStore}
                                  context={ReactReduxContext}>
                            <HelmetProvider>
                                <BrowserRouter>
                                    <ScrollBackManager>
                                        <LayoutDefault
                                            routes={[...routes.static.common, ...routes.static.home, ...routes.static.notFound]}
                                            hashRoutes={routes.hashes}
                                            {...this._componentProps()}/>
                                    </ScrollBackManager>
                                </BrowserRouter>
                            </HelmetProvider>
                        </Provider>
                    </ThemeProvider>
                </CacheProvider>
            </StyledEngineProvider>
        );
    }
}
