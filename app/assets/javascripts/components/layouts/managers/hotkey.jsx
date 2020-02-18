'use strict';

import {
    withRouter
} from 'react-router-dom';

// Keyboard inputs
import Mousetrap from 'mousetrap';

import {
    newArticlePath,
    searchParam
} from '../../../constants/routesHelper';

import {
    showUserLogin,
    showTopicPopup,
    showUserPreference
} from '../../../actions';

export default @withRouter
@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug
}), {
    showUserLogin,
    showTopicPopup,
    showUserPreference
})
class HotkeyManager extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        // from router
        history: PropTypes.object,
        // from connect
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        showUserLogin: PropTypes.func,
        showTopicPopup: PropTypes.func,
        showUserPreference: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._setHotkeys();
    }

    _setHotkeys = () => {
        Mousetrap.bind('alt+a', (event) => {
            event.preventDefault();
            this.props.history.push(newArticlePath(this.props.currentUserSlug, this.props.currentUserTopicSlug));
        }, 'keydown');

        Mousetrap.bind('alt+l', (event) => {
            event.preventDefault();
            this.props.showUserLogin();
        }, 'keydown');

        Mousetrap.bind('alt+t', (event) => {
            event.preventDefault();
            this.props.showTopicPopup();
        }, 'keydown');

        Mousetrap.bind('alt+s', (event) => {
            event.preventDefault();
            this.props.history.push({
                hash: searchParam
            });
        }, 'keydown');

        Mousetrap.bind('alt+p', (event) => {
            event.preventDefault();
            this.props.showUserPreference();
        }, 'keydown');
    };

    render() {
        return React.Children.only(this.props.children);
    }
}
