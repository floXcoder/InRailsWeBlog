'use strict';

import {
    getDisplayName
} from './common';

import {
    // highlightedLanguagePrefix,
    highlightedLanguages
} from './constants';

import HighlightLoader from '../loaders/highlight';

export default function highlight(highlightOnShow = true) {
    return function highlighter(WrappedComponent) {
        return class HighlightComponent extends React.Component {
            static displayName = `HighlightComponent(${getDisplayName(WrappedComponent)})`;

            constructor(props) {
                super(props);

                this._highlighter = undefined;

                this._highlightedElements = [];

                this._unmounted = false;

                this._highlightTimeout = null;

                this._wrapperRef = React.createRef();
            }

            componentDidMount() {
                if (window.seoMode) {
                    return;
                }

                if (this._checkNodesPresence()) {
                    this._loadHighlighter();
                }
            }

            componentDidUpdate() {
                if (window.seoMode) {
                    return;
                }

                if (highlightOnShow) {
                    this._highlightTimeout = setTimeout(() => this._highlightCode(), 5);
                }
            }

            componentWillUnmount() {
                this._unmounted = true;

                if (this._highlightTimeout) {
                    clearTimeout(this._highlightTimeout);
                }
            }

            _loadHighlighter = () => {
                HighlightLoader(({HighlightCode}) => {
                    this._highlighter = HighlightCode;

                    this._highlighter.configure({
                        // classPrefix: 'language-',
                        languages: highlightedLanguages.flat(),
                        ignoreUnescapedHTML: true
                    });

                    if (highlightOnShow) {
                        this._highlightTimeout = setTimeout(() => this._highlightCode(), 5);
                    }
                });
            };

            _checkNodesPresence = () => {
                const wrapperNode = this._wrapperRef.current;
                const nodes = wrapperNode.querySelectorAll('pre');

                return !!nodes.length;
            };

            _handleShow = (elementId, force = false) => {
                if (!this._highlighter) {
                    if (this._checkNodesPresence()) {
                        this._loadHighlighter();
                    }
                }

                if (!this._highlightedElements.includes(elementId) || force) {
                    this._highlightedElements.push(elementId);
                    this._highlightTimeout = setTimeout(() => this._highlightCode(), 5);
                }
            };

            _highlightCode = () => {
                if (!this._highlighter || this._unmounted) {
                    return;
                }

                const wrapperNode = this._wrapperRef.current;
                const nodes = wrapperNode.querySelectorAll('pre');
                if (nodes.length > 0) {
                    for (let i = 0; i < nodes.length; i += 1) {
                        this._highlighter.highlightElement(nodes[i]);
                    }
                }
            };

            render() {
                const propsProxy = {
                    ...this.props,
                    onShow: this._handleShow
                };

                return (
                    <div ref={this._wrapperRef}>
                        <WrappedComponent {...propsProxy}/>
                    </div>
                );
            }
        };
    };
}
