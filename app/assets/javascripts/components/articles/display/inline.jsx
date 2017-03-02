'use strict';

import HighlightCode from 'highlight.js';

export default class ArticleInlineDisplay extends React.Component {
    static propTypes = {
        children: React.PropTypes.string.isRequired,
        article: React.PropTypes.object.isRequired
    };

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

    _highlightCode() {
        let domNode = ReactDOM.findDOMNode(this);
        let nodes = domNode.querySelectorAll('pre code');
        if (nodes.length > 0) {
            for (let i = 0; i < nodes.length; i = i + 1) {
                HighlightCode.highlightBlock(nodes[i]);
            }
        }
    }

    render() {
        return (
            <div className="blog-article-item">
                <h4 className="article-title-inline">
                    {this.props.article.title}
                </h4>

                <span className="blog-article-content"
                      dangerouslySetInnerHTML={{__html: this.props.children}}/>
            </div>
        );
    }
}
