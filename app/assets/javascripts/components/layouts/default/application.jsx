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

import {
    extractDataFromElement
} from '../../../middlewares/json';

import routes from '../../../routes';

import browserHistory from '../../modules/browserHistory';
import ScrollBackManager from '../../modules/scrollBackManager';

import ErrorBoundary from '../../errors/boundary';

import HeaderLayoutDefault from './header';
import MainLayoutDefault from './main';
import FooterLayoutDefault from './footer';

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
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>

                <Provider store={configureStore}
                          context={ReactReduxContext}>
                    <HelmetProvider>
                        <Router history={browserHistory}>
                            <ScrollBackManager>
                                <>
                                    <ErrorBoundary errorType="text"
                                                   errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                                        <HeaderLayoutDefault history={browserHistory}
                                                             hashRoutes={routes.hashes}/>
                                    </ErrorBoundary>

                                    <ErrorBoundary errorType="card">
                                        <MainLayoutDefault
                                            routes={[...routes.static.common, ...routes.static.home, ...routes.static.notFound]}
                                            {...this._componentProps()}/>
                                    </ErrorBoundary>

                                    <ErrorBoundary errorType="text"
                                                   errorTitle={I18n.t('js.helpers.errors.boundary.footer')}>
                                        <FooterLayoutDefault/>
                                    </ErrorBoundary>
                                </>
                            </ScrollBackManager>
                        </Router>
                    </HelmetProvider>
                </Provider>
            </MuiThemeProvider>
        );
    }
}
