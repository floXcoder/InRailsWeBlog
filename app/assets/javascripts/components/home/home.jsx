'use strict';

// Init user if connected
import UserStore from '../../stores/userStore';

import ClipboardManager from '../../modules/clipboard';
import SanitizePaste from '../../modules/wysiwyg/sanitize-paste';

import TagSidebar from '../tags/sidebar';

import HomeHeader from './header';
import HomeFooter from './footer';

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

    _userLoaded = () => {
        ClipboardManager.initialize(this._onPaste);
    };

    _onPaste = (content) => {
        if (this.props.location.pathname !== '/article/new') {
            this.context.router.push({
                pathname: '/article/new',
                state: {article: {content: SanitizePaste.parse(content), draft: true}}
            });
        }
    };

    _handleGoToTopClick = (event) => {
        event.preventDefault();
        window.scrollTo(0, 0);
        return false;
    };

    render() {
        return (
            <div className="row">
                <HomeHeader />

                <div className="col s3">
                    <div className="blog-sidebar">
                        <TagSidebar isOpened={this.state.isTags}/>
                    </div>
                </div>

                <div className="col s9">
                    <div className="container blog-main">
                        {this.props.children}
                    </div>

                    <a className="goto-top hide-on-small-and-down"
                       onClick={this._handleGoToTopClick}/>
                </div>

                <HomeFooter />
            </div>
        );
    }
}
