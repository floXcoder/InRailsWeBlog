import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import withRouter from '@js/components/modules/router';

import {
    newArticlePath
} from '@js/constants/routesHelper';

import {
    onPageReady
} from '@js/components/loaders/lazyLoader';

import ClipboardManager from '@js/modules/clipboard';


class PasteManager extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        // from router
        routeLocation: PropTypes.object,
        routeNavigate: PropTypes.func,
        // from connect
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        onPageReady(() => ClipboardManager.initialize(this._onPaste));
    }

    _onPaste = (content) => {
        if (content && !this.props.routeLocation.pathname.includes('/article-new') && !this.props.routeLocation.pathname.includes('/edit')) {
            this.props.routeNavigate({
                pathname: newArticlePath(this.props.currentUserSlug, this.props.currentUserTopicSlug)
            }, {
                state: {
                    isPaste: true,
                    pasteContent: content
                }
            });
        }
    };

    render() {
        return React.Children.only(this.props.children);
    }
}

export default connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug
}))(withRouter({
    location: true,
    navigate: true
})(PasteManager));