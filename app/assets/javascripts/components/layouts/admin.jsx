'use strict';

import {
    MuiThemeProvider
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
    withStyles
} from '@material-ui/core/styles';

import {
    Provider,
    ReactReduxContext
} from 'react-redux';

import {
    configureStore
} from '../../stores/admin';

import ErrorBoundary from '../errors/boundary';

import AdminHeaderLayout from './admin/header';
import AdminMainLayout from './admin/main';
import AdminFooterLayout from './admin/footer';

import theme from '../../../jss/theme';

import styles from '../../../jss/admin/layout';

export default @withStyles(styles)
class AdminLayout extends React.Component {
    static propTypes = {
        componentId: PropTypes.string,
        children: PropTypes.object,
        // from styles
        classes: PropTypes.object
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
                    <div className={this.props.classes.root}>
                        <ErrorBoundary errorType="text"
                                       errorTitle={I18n.t('js.helpers.errors.boundary.header')}>
                            <AdminHeaderLayout/>
                        </ErrorBoundary>

                        <ErrorBoundary errorType="card">
                            <AdminMainLayout componentId={this.props.componentId}>
                                {this.props.children}
                            </AdminMainLayout>
                        </ErrorBoundary>

                        <ErrorBoundary errorType="text"
                                       errorTitle={I18n.t('js.helpers.errors.boundary.footer')}>
                            <AdminFooterLayout/>
                        </ErrorBoundary>
                    </div>
                </Provider>
            </MuiThemeProvider>
        );
    }
}
