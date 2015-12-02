'use strict';

var ArticleAuthorIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired
    },

    render () {
        if(this.props.article.author) {
            return (
                <div className="article-author">
                    <i className="material-icons">account_circle</i>
                    {this.props.article.author.pseudo}
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleAuthorIcon;
