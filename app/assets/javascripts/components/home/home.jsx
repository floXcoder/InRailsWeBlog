'use strict';

// Init user if connected
import UserStore from '../../stores/userStore';

import ClipboardManager from '../../modules/clipboard';
import SanitizePaste from '../../modules/wysiwyg/sanitize-paste';

import HomeHeader from './header';
import HomeFooter from './footer';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import CommonStyle from '../../style/common';
const muiTheme = getMuiTheme(CommonStyle);

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

export default class HomePage extends Reflux.Component {
    static propTypes = {
        location: React.PropTypes.object,
        children: React.PropTypes.object
    };

    static childContextTypes = {
        router: React.PropTypes.object
    };

    static defaultProps = {
        location: {}
    };

    state = {
        isLoadingUser: false
    };

    constructor(props) {
        super(props);

        this.mapStoreToState(UserStore, this.onUserChange);
    }

    componentWillMount() {
        if ($app.user.isPresent() && !$app.user.isConnected()) {
            this.setState({
                isLoadingUser: true
            });
        }
    }

    componentDidMount() {
    }

    onUserChange(userData) {
        if ($.isEmpty(userData)) {
            return;
        }

        let newState = {};

        if (userData.type === 'loadUser') {
            newState.isLoadingUser = false;
            this._userLoaded();
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    }

    _userLoaded() {
        ClipboardManager.initialize(this._onPaste);
    }

    _onPaste(content) {
        if (this.props.location.pathname !== '/article/new') {
            this.context.router.push({
                pathname: '/article/new',
                state: {article: {content: SanitizePaste.parse(content), draft: true}}
            });
        }
    }

    _handleGoToTopClick(event) {
        event.preventDefault();
        window.scrollTo(0, 0);
        return false;
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <HomeHeader />

                    <div className="container blog-main">
                        {this.props.children}
                    </div>

                    <a className="goto-top hide-on-small-and-down"
                       onClick={this._handleGoToTopClick}/>

                    <HomeFooter />
                </div>
            </MuiThemeProvider>
        );
    }
}
