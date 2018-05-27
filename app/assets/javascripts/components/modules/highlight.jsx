'use strict';

import {
    getDisplayName
} from './common';

import HighlightCode from 'highlight.js';

export default function highlight(isHighligthingOnShow = true) {
    return function highlighter(WrappedComponent) {
        return class HighlightComponent extends React.Component {
            static displayName = `HighlightComponent(${getDisplayName(WrappedComponent)})`;

            constructor(props) {
                super(props);

                this._highlightedElements = [];
            }

            componentDidMount() {
                HighlightCode.configure({
                    tabReplace: '  ' // 4 spaces
                });

                if (!isHighligthingOnShow) {
                    setTimeout(() => this._highlightCode(), 5);
                }
            }

            componentDidUpdate() {
                if (!isHighligthingOnShow) {
                    setTimeout(() => this._highlightCode(), 5);
                }
            }

            _handleShow = (elementId) => {
                if (!this._highlightedElements.includes(elementId)) {
                    this._highlightedElements.push(elementId);
                    setTimeout(() => this._highlightCode(), 5);
                }
            };

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
                    ...this.props,
                    onShow: this._handleShow
                };

                return <WrappedComponent {...propsProxy} />;
            }
        }
    }
}
