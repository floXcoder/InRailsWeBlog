import marked from 'marked';

var ArticleActions = require('../../actions/articleActions');

var ArticleItem = React.createClass({
    _onArticleWithTag: function (tagId, event) {
        ArticleActions.loadArticles({tags: tagId});
    },

    _rawMarkup: function () {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return {__html: rawMarkup};
    },

    _renderVisibility: function () {
        if(this.props.article.visibility === 'everyone') {
            return (
                <div className="right article-icon article-public">
                    <i className="material-icons prefix">visibility</i>
                </div>
            );
        } else {
            return (
                <div className="right article-icon article-private">
                    <i className="material-icons prefix">visibility_off</i>
                </div>
            );
        }
    },

    _renderAuthor: function () {
        return (
            <div className="right article-icon">
                <i className="material-icons prefix">account_circle</i>
                {this.props.article.author}
            </div>
        );
    },

    render: function () {
        if (this.props.articleDisplayMode === 'inline') {
            return (
                <div className="blog-article-item">
                    <h4>
                        {this.props.article.title}
                    </h4>
                    <span dangerouslySetInnerHTML={{__html: this.props.children}}/>
                </div>
            );
        } else if (this.props.articleDisplayMode === 'card') {
            var Tags = this.props.article.tags.map(function (tag) {
                return (
                    <a key={tag.id}
                       onClick={this._onArticleWithTag.bind(this, tag.id)}
                       className="waves-effect waves-light btn-small grey lighten-5 black-text">
                        {tag.name}
                    </a>
                );
            }.bind(this));

            return (
                <div className="card blog-article-item">
                    <div className="card-content">
                        <div>
                            <span className="card-title black-text">
                                <h4>{this.props.article.title}</h4>
                            </span>
                            <span dangerouslySetInnerHTML={{__html: this.props.children}}/>
                        </div>
                    </div>
                    <div className="card-action">
                        {Tags}
                        {this._renderVisibility()}
                        {this._renderAuthor()}
                    </div>
                </div>
            );
        } else {
            log.info('Article display mode unknown: ' + this.props.articleDisplayMode);
            return null;
        }
    }
});

module.exports = ArticleItem;
