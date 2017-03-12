'use strict';

// Init user if connected
import UserStore from '../../stores/userStore';

import ClipboardManager from '../../modules/clipboard';
import SanitizePaste from '../../modules/wysiwyg/sanitize-paste';

import {
    Link
} from 'react-router-dom';

export default class HomePage extends Reflux.Component {
    static propTypes = {
        location: React.PropTypes.object,
        children: React.PropTypes.object
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
            this.context.router.history.push({
                pathname: '/article/new',
                state: {article: {content: SanitizePaste.parse(content), draft: true}}
            });
        }
    };

    render() {
        return (
            <div className="">
                <h1>
                    HOME
                </h1>
            </div>
        );
    }
}
