'use strict';

var ArticleLink = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired
    },

    render () {
        return (
            <a className="article-icons"
               href={"/articles/" + this.props.article.slug} >
                <i className="material-icons article-goto">home</i>
            </a>
        );
    }
});

module.exports = ArticleLink;
