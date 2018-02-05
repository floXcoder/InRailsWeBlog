'use strict';

import {
    getDisplayName
} from './common';

import ClipboardManager from '../../modules/clipboard';
import SanitizePaste from '../../modules/sanitizePaste';

export default function pasteManager(WrappedComponent) {
    return class PasteManagerComponent extends React.Component {
        static displayName = `PasteManagerComponent(${getDisplayName(WrappedComponent)})`;

        constructor(props) {
            super(props);

            this._pasteCallback = null;
        }

        componentDidMount() {
            ClipboardManager.initialize(this._onPaste);
        }

        _onPaste = (content) => {
            if (this._pasteCallback) {
                this._pasteCallback(SanitizePaste.parse(content))
            }
        };

        _handlePaste = (callback) => {
            this._pasteCallback = callback;
        };

        render() {
            const propsProxy = {
                ...this.props,
                onPaste: this._handlePaste
            };

            return <WrappedComponent {...propsProxy} />;
        }
    }
}
