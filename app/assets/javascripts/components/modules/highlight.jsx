import React from 'react';

import {
    getDisplayName
} from '@js/components/modules/common';

import {
    // highlightedLanguagePrefix,
    highlightedLanguages
} from '@js/components/modules/constants';

import HighlightLoader from '@js/components/loaders/highlight';

export default function highlight(highlightOnShow = true) {
    return function highlighter(WrappedComponent) {
        return class HighlightComponent extends React.Component {
            static displayName = `HighlightComponent(${getDisplayName(WrappedComponent)})`;

            static HIGHLIGHT_TIMEOUT = 50;

            constructor(props) {
                super(props);

                this._highlighter = undefined;

                this._highlightedElements = [];

                this._isHighlighted = false;

                this._unmounted = false;

                this._highlightTimeout = null;

                this._wrapperRef = React.createRef();
            }

            componentDidMount() {
                if (this.props.isHighlighted === false || window.seoMode) {
                    return;
                }

                if (this._checkNodesPresence()) {
                    this._loadHighlighter();
                }
            }

            componentDidUpdate() {
                if (this.props.isHighlighted === false || window.seoMode) {
                    return;
                }

                if (highlightOnShow) {
                    this._highlightTimeout = setTimeout(() => this._highlightCode(), HighlightComponent.HIGHLIGHT_TIMEOUT);
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
                        this._highlightTimeout = setTimeout(() => this._highlightCode(), HighlightComponent.HIGHLIGHT_TIMEOUT);
                    }
                });
            };

            _checkNodesPresence = () => {
                const wrapperNode = this._wrapperRef.current;
                const nodes = wrapperNode.querySelectorAll('pre');

                return !!nodes.length;
            };

            _handleShow = (elementId, force = false) => {
                if (this.props.isHighlighted === false || window.seoMode) {
                    return;
                }

                if (!this._highlightedElements.includes(elementId) || force) {
                    if (!this._highlighter) {
                        if (this._checkNodesPresence()) {
                            this._loadHighlighter();
                        }
                    }

                    if (force) {
                        this._isHighlighted = false;

                        this._highlightCode();
                    } else {
                        this._highlightedElements.push(elementId);

                        this._highlightTimeout = setTimeout(() => this._highlightCode(), HighlightComponent.HIGHLIGHT_TIMEOUT);
                    }
                }
            };

            _highlightCode = () => {
                if (!this._highlighter || this._isHighlighted || this._unmounted) {
                    return;
                }

                const wrapperNode = this._wrapperRef.current;
                const nodes = wrapperNode.querySelectorAll('pre');
                if (nodes.length > 0) {
                    for (let i = 0; i < nodes.length; i += 1) {
                        this._highlighter.highlightElement(nodes[i]);
                    }

                    this._isHighlighted = true;
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
