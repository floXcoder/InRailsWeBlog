'use strict';

import withRouter from './router';

import {
    newArticlePath
} from '../../constants/routesHelper';

import ClipboardManager from '../../modules/clipboard';


export default @connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug
}))
@withRouter({
    location: true,
    navigate: true
})
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
        setTimeout(() => ClipboardManager.initialize(this._onPaste), 500);
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
