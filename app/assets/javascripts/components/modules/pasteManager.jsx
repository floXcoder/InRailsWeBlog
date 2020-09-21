'use strict';

import {
    withRouter
} from 'react-router-dom';

import {
    newArticlePath
} from '../../constants/routesHelper';

import ClipboardManager from '../../modules/clipboard';

export default @withRouter
@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug
}))
class PasteManager extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        // from router
        location: PropTypes.object,
        history: PropTypes.object,
        // from connect
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => ClipboardManager.initialize(this._onPaste), 500);
    }

    _onPaste = (content) => {
        if (content && !this.props.location.pathname.includes('/article-new') && !this.props.location.pathname.includes('/edit')) {
            this.props.history.push({
                pathname: newArticlePath(this.props.currentUserSlug, this.props.currentUserTopicSlug),
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
