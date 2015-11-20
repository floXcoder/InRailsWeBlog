"use strict";

var HighlightCode = require('highlight.js');

var ArticleInlineDisplay = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired
    },

    componentDidMount: function () {
        HighlightCode.configure({
            tabReplace: '  ' // 4 spaces
        });

        this._highlightCode();
    },

    componentDidUpdate: function () {
        this._highlightCode();
    },

    _highlightCode: function () {
        var domNode = ReactDOM.findDOMNode(this);
        var nodes = domNode.querySelectorAll('pre code');
        if (nodes.length > 0) {
            for (var i = 0; i < nodes.length; i = i + 1) {
                HighlightCode.highlightBlock(nodes[i]);
            }
        }
    },

    render: function () {
        return (
            <div className="blog-article-item">
                <h4 className="article-title-inline">
                    {this.props.article.title}
                </h4>
                <span dangerouslySetInnerHTML={{__html: this.props.children}}/>
            </div>
        );
    }
});

module.exports = ArticleInlineDisplay;
