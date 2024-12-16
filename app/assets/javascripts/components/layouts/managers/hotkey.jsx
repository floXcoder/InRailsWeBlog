import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

// Keyboard inputs
import Mousetrap from 'mousetrap';

import {
    showUserLogin,
    showTopicPopup,
    showUserPreference
} from '@js/actions/uiActions';

import withRouter from '@js/components/modules/router';

import {
    newArticlePath,
    searchParam
} from '@js/constants/routesHelper';


class HotkeyManager extends React.Component {
    static propTypes = {
        children: PropTypes.object.isRequired,
        // from router
        routeNavigate: PropTypes.func,
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

    _setHotkeys = () => {
        Mousetrap.bind('alt+a', (event) => {
            event.preventDefault();

            this.props.routeNavigate(newArticlePath(this.props.currentUserSlug, this.props.currentUserTopicSlug));
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

            this.props.routeNavigate({
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

export default connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug
}), {
    showUserLogin,
    showTopicPopup,
    showUserPreference
})(withRouter({navigate: true})(HotkeyManager))