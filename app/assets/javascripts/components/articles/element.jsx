var ArticleActions = require('../../actions/articleActions');
var ArticleStore = require('../../stores/articleStore');
var ArticleHistory = require('./history');

var HighlightCode = require('highlight.js');

var ArticleElement = React.createClass({
    mixins: [
        Reflux.listenTo(ArticleStore, 'onArticleChange')
    ],

    getInitialState: function () {
        return {
            articleVersions: null,
            article: this.props.article,
            isHistoryDisplayed: false
        };
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

    _showHistory: function () {
        if(this.state.isHistoryDisplayed) {
            this.setState({isHistoryDisplayed: false})
        } else {
            ArticleActions.loadArticleHistory({history: this.state.article.id});
        }

        this.state.isHistoryDisplayed = !this.state.isHistoryDisplayed;
    },

    onArticleChange: function (articleStore) {
        var newState = {};

        if (typeof(articleStore.articleVersions) !== 'undefined') {
            newState.articleVersions = articleStore.articleVersions;
            if(articleStore.articleVersions.length === 0) {
                Materialize.toast(I18n.t('js.article.history.none'));
            }
        }

        if (typeof(articleStore.articleRestored) !== 'undefined') {
            newState.article = articleStore.articleRestored;
            Materialize.toast(I18n.t('js.article.history.restored'));
            this._showHistory();
        }

        if (!$utils.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _renderIsLinkIcon: function () {
        if (this.state.article.is_link) {
            return (
                <div className="article-icons">
                    <i className="material-icons article-link">link</i>
                </div>
            );
        } else {
            return null;
        }
    },

    _renderVisibilityIcon: function () {
        if (this.props.userId && this.props.userId === this.state.article.id) {
            if (this.state.article.visibility === 'everyone') {
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

    _renderAuthorIcon: function () {
        return (
            <div className="article-icons">
                <i className="material-icons">account_circle</i>
                {this.state.article.author}
            </div>
        );
    },

    _renderHistoryIcon: function () {
        if (this.props.userId && this.props.userId === this.state.article.author_id) {
            return (
                <div className="article-icons" onClick={this._showHistory}>
                    <i className="material-icons article-history">history</i>
                </div>
            );
        }
    },

    _renderEditIcon: function () {
        if (this.props.userId && this.props.userId === this.state.article.author_id) {
            return (
                <a className="article-icons" href={"/articles/" + this.state.article.id + "/edit"}>
                    <i className="material-icons article-edit">mode_edit</i>
                </a>
            );
        }
    },

    _renderHistory: function () {
        if (this.state.isHistoryDisplayed) {
            return (
                <ArticleHistory articleVersions={this.state.articleVersions}/>
            );
        }
    },

    render: function () {
        var childTags = _.indexBy(this.state.article.child_tags, 'id');
        var parentTags = _.indexBy(this.state.article.parent_tags, 'id');

        var Tags = this.state.article.tags.map(function (tag) {
            var relationshipClass = '';
            if (parentTags[tag.id]) {
                relationshipClass = 'tag-parent';
            } else if (childTags[tag.id]) {
                relationshipClass = 'tag-child';
            }

            return (
                <a key={tag.id}
                   href={"/tags/" + tag.slug}
                   className={"waves-effect waves-light btn-small article-tag " + relationshipClass}>
                    {tag.name}
                </a>
            );
        }.bind(this));

        return (
            <div>
                <div className="card clearfix blog-article-item">
                    <div className="card-content">
                        <div>
                        <span className="card-title black-text">
                            <h4 className="article-title-card">
                                {this.state.article.title}
                            </h4>
                            <h6 className="article-summary">
                                {this.state.article.summary}
                            </h6>
                        </span>
                            <span dangerouslySetInnerHTML={{__html: this.state.article.content}}/>
                        </div>
                    </div>
                    <div className="card-action clearfix">
                        {Tags}
                        <div className="right">
                            {this._renderIsLinkIcon()}
                            {this._renderVisibilityIcon()}
                            {this._renderHistoryIcon()}
                            {this._renderEditIcon()}
                        </div>
                    </div>
                </div>

                {this._renderHistory()}
            </div>
        );
    }
});

module.exports = ArticleElement;
