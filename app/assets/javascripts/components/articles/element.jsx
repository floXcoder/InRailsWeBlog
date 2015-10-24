var ArticleActions = require('../../actions/articleActions');

var HighlightCode = require('highlight.js');

var ArticleElement = React.createClass({
    getInitialState: function () {
        return {};
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

    _renderIsLink: function () {
        if (this.props.article.is_link) {
            return (
                <div className="article-icons">
                    <i className="material-icons article-link">link</i>
                </div>
            );
        } else {
            return null;
        }
    },

    _renderVisibility: function () {
        if (this.props.userId && this.props.userId === this.props.article.id) {
            if (this.props.article.visibility === 'everyone') {
                return (
                    <div className="article-icons">
                        <i className="material-icons article-public">visibility</i>
                    </div>
                );
            } else {
                return (
                    <div className="article-icons">
                        <i className="material-icons article-private">visibility_off</i>
                    </div>
                );
            }
        }
    },

    _renderAuthor: function () {
        return (
            <div className="article-icons">
                <i className="material-icons">account_circle</i>
                {this.props.article.author}
            </div>
        );
    },

    _renderEdit: function () {
        if (this.props.userId && this.props.userId === this.props.article.author_id) {
            return (
                <a className="article-icons" href={"/articles/" + this.props.article.id + "/edit"}>
                    <i className="material-icons article-edit">mode_edit</i>
                </a>
            );
        }
    },

    render: function () {
        var Tags = this.props.article.tags.map(function (tag) {
            return (
                <a key={tag.id}
                   href={"/tags/" + tag.slug}
                   className="waves-effect waves-light btn-small grey lighten-5 black-text">
                    {tag.name}
                </a>
            );
        }.bind(this));

        return (
            <div className="card clearfix blog-article-item">
                <div className="card-content">
                    <div>
                        <span className="card-title black-text">
                            <h4 className="article-title-card">
                                {this.props.article.title}
                            </h4>
                            <h6 className="article-summary">
                                {this.props.article.summary}
                            </h6>
                        </span>
                        <span dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                    </div>
                </div>
                <div className="card-action">
                    {Tags}
                    <div className="right">
                        {this._renderIsLink()}
                        {this._renderVisibility()}
                        {this._renderEdit()}
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ArticleElement;
