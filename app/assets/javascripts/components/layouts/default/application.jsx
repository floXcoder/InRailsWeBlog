'use strict';

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

import routes from '../../../routes';

import ScrollBackManager from '../../modules/scrollBackManager';

import LayoutDefault from './layout';

import theme from '../../../theme';


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
            ...extractDataFromElement(this.props.componentId)
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
            </StyledEngineProvider>
        );
    }
}
