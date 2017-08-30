'use strict';

import {
    connect
} from 'react-redux';

import HighlightCode from 'highlight.js';

import {
    getArticleTitle,
    getArticleContent
} from '../../../selectors/articleSelectors';

@connect((state, props) => ({
    title: getArticleTitle(state.articleState, props.articleId),
    content: getArticleContent(state.articleState, props.articleId)
}))
export default class ArticleInlineDisplay extends React.Component {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        title: PropTypes.string,
        content: PropTypes.string
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
        return (
            <div className="blog-article-item">
                <h4 className="article-title-inline">
                    {this.props.title}
                </h4>

                <span className="blog-article-content"
                      dangerouslySetInnerHTML={{__html: this.props.content}}/>
            </div>
        );
    }
}
