'use strict';

var HighlightCode = require('highlight.js');

var ArticleInlineDisplay = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        article: React.PropTypes.object.isRequired
    },

    componentDidMount () {
        HighlightCode.configure({
            tabReplace: '  ' // 4 spaces
        });

        this._highlightCode();
    },

    componentDidUpdate () {
        this._highlightCode();
    },

    _highlightCode () {
        let domNode = ReactDOM.findDOMNode(this);
        let nodes = domNode.querySelectorAll('pre code');
        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i = i + 1) {
                HighlightCode.highlightBlock(nodes[i]);
            }
        }
    },

    render () {
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
