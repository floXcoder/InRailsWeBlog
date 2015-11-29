'use strict';

var ArticleLinkIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired
    },

    render () {
        return (
            <div className="article-author">
                <i className="material-icons">account_circle</i>
                {this.props.article.author.pseudo}
            </div>
        );
    }
});

module.exports = ArticleLinkIcon;
