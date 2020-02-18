'use strict';

import {
    withRouter
} from 'react-router-dom';

import {
    newArticleRedirectPath
} from '../../constants/routesHelper';

import ClipboardManager from '../../modules/clipboard';

export default @withRouter
class PasteManager extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        // from router
        location: PropTypes.object,
        history: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => ClipboardManager.initialize(this._onPaste), 500);
    }

    _onPaste = (content) => {
        if (content && this.props.location.pathname !== newArticleRedirectPath()) {
            this.props.history.push({
                pathname: newArticleRedirectPath(),
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
