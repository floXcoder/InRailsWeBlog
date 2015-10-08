import marked from 'marked';

var ArticleActions = require('../../actions/articleActions');

var ArticleItem = React.createClass({
    _displayArticleWithTag: function (tagId, event) {
        ArticleActions.loadArticles({tags: tagId});
    },

    _rawMarkup: function () {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return {__html: rawMarkup};
    },

    render: function () {
        if (this.props.displayType === 'inline') {
            return (
                <div className="blog-article-item">
                    <h4>
                        {this.props.article.title}
                    </h4>
                    <span dangerouslySetInnerHTML={this._rawMarkup()}/>
                </div>
            );
        } else if (this.props.displayType === 'separated') {
            var Tags = this.props.article.tags.map(function (tag) {
                return (
                    <a key={tag.id}
                       onClick={this._displayArticleWithTag.bind(this, tag.id)}
                       className="waves-effect waves-light btn-small grey lighten-5 black-text">
                        {tag.name}
                    </a>
                );
            }.bind(this));

            //- Article card, données à afficher : comments, creator

            return (
                <div className="card">
                    <div className="card-content">
                        <div className="blog-article-item">
                            <span className="card-title black-text">
                                <h4>{this.props.article.title}</h4>
                            </span>
                            <span dangerouslySetInnerHTML={this._rawMarkup()}/>
                        </div>
                    </div>
                    <div className="card-action">
                        {Tags}
                        <div className="right">
                            <i className="material-icons prefix">account_circle</i>
                            {this.props.article.author}
                        </div>
                    </div>
                </div>
            );
        }
    }
});

module.exports = ArticleItem;
