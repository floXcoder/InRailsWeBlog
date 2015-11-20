"use strict";

var ArticleLink = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired
    },

    render: function () {
        return (
            <a className="article-icons article-goto"
               href={"/articles/" + this.props.article.slug} >
                <i className="material-icons">forward</i>
            </a>
        );
    }
});

module.exports = ArticleLink;
