'use strict';

import {
    withRouter
} from 'react-router-dom';

import ClipboardManager from '../../modules/clipboard';
import SanitizePaste from '../../modules/sanitizePaste';

@withRouter
export default class PasteManager extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
        // From router
        location: PropTypes.object,
        history: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ClipboardManager.initialize(this._onPaste);
    }

    _onPaste = (content) => {
        if (content && this.props.location.pathname !== '/article/new' && this.props.location.hash !== '#new-article') {
            const isURL = Utils.isURL(content.trim());

            let articleData = {
                mode: isURL ? 'link' : 'story',
                isDraft: true
            };
            if (isURL) {
                articleData.reference = content.trim();
            } else {
                articleData.content = SanitizePaste.parse(content);
            }

            this.props.history.replace({
                hash: '#new-article',
                state: {
                    ...articleData
                }
            });
        }
    };

    render() {
        return React.Children.only(this.props.children);
    }
}
