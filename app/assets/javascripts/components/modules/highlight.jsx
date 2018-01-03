'use strict';

import {
    getDisplayName
} from './common';

import HighlightCode from 'highlight.js';

export default function highlight(WrappedComponent) {
    return class HighlightComponent extends React.Component {
        static displayName = `HighlightComponent(${getDisplayName(WrappedComponent)})`;

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            HighlightCode.configure({
                tabReplace: '  ' // 4 spaces
            });

            this._highlightCode();
        }

        componentDidUpdate() {
            this._highlightCode();
        }

        _highlightCode = () => {
            let domNode = ReactDOM.findDOMNode(this);
            let nodes = domNode.querySelectorAll('pre code');
            if (nodes.length > 0) {
                for (let i = 0; i < nodes.length; i = i + 1) {
                    HighlightCode.highlightBlock(nodes[i]);
                }
            }
        };

        render() {
            const propsProxy = {
                ...this.props
            };

            return <WrappedComponent {...propsProxy} />;
        }
    }
}
