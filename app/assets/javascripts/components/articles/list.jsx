var ArticleItem = require('./item');
var ArticleActions = require('../../actions/articleActions');
var InfiniteScroll = require('../../components/materialize/infiniteScroll');

var ArticleList = React.createClass({
    getInitialState: function () {
        return {
            hasMore: true,
            articleLength: 0
        };
    },

    _loadNextArticles: function () {
        if (this.props.articles.length > 0 && this.props.articles.length !== this.state.articleLength) {
            ArticleActions.loadNextArticles();
            this.state.articleLength = this.props.articles.length;
        } else {
            this.state.hasMore = false;
        }
    },

    _displayMode: function () {
        var ArticleNodes = this.props.articles.map(function (article) {
            var articleContent = this.props.highlightResults && !$utils.isEmpty(article.highlight_content) ?
                article.highlight_content :
                article.content;

            if(article.show) {
                return (
                    <ArticleItem key={article.id} article={article} articleDisplayMode={this.props.articleDisplayMode}>
                        {articleContent}
                    </ArticleItem>
                );
            }
        }.bind(this));

        if (this.props.articleDisplayMode === 'inline') {
            return (
                <div className="card-panel">
                    <div className="articleList">
                        <InfiniteScroll loadMore={this._loadNextArticles} hasMore={this.state.hasMore}>
                            {ArticleNodes}
                        </InfiniteScroll>
                    </div>
                </div>
            );
        } else if (this.props.articleDisplayMode === 'card') {
            return (
                <div className="blog-article-list">
                    <InfiniteScroll loadMore={this._loadNextArticles} hasMore={this.state.hasMore}>
                        {ArticleNodes}
                    </InfiniteScroll>
                </div>
            );
        }
    },

    render: function () {
        return (
            <div className="row">
                <div className="col s12">
                    { this._displayMode() }
                </div>
            </div>
        );
    }
});

module.exports = ArticleList;
