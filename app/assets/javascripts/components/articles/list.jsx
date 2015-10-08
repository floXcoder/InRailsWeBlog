var ArticleItem = require('./item');
var ArticleActions = require('../../actions/articleActions');
var InfiniteScroll = require('../../components/materialize/infiniteScroll');

var ArticleList = React.createClass({
    getInitialState: function () {
        return {
            hasMore: true,
            currentPage: 0,
            articleLength: 0
        };
    },

    _loadMoreArticles: function (page) {
        this.state.currentPage = page;

        if (this.props.articles.length > 0 && this.props.articles.length !== this.state.articleLength) {
            ArticleActions.loadMoreArticles({page: page});
            this.state.articleLength = this.props.articles.length;
        } else {
            this.state.hasMore = false;
        }
    },

    _displayMode: function () {
        var ArticleNodes = this.props.articles.map(function (article) {
            if(article.show) {
                return (
                    <ArticleItem key={article.id} article={article} displayType={this.props.displayType}>
                        {article.content}
                    </ArticleItem>
                );
            }
        }.bind(this));

        if (this.props.displayType === 'inline') {
            return (
                <div className="card-panel">
                    <div className="articleList">
                        <InfiniteScroll pageStart={this.state.currentPage + 1} loadMore={this._loadMoreArticles} hasMore={this.state.hasMore}>
                            {ArticleNodes}
                        </InfiniteScroll>
                    </div>
                </div>
            );
        } else if (this.props.displayType === 'separated') {
            return (
                <div className="blog-article-list">
                    <InfiniteScroll pageStart={this.state.currentPage + 1} loadMore={this._loadMoreArticles} hasMore={this.state.hasMore}>
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
