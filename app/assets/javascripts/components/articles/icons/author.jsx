"use strict";

var ArticleLinkIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired
    },

    render: function () {
        return (
            <div className="article-icons">
                <i className="material-icons">account_circle</i>
                {this.props.article.author.pseudo}
            </div>
        );
    }
});

module.exports = ArticleLinkIcon;
