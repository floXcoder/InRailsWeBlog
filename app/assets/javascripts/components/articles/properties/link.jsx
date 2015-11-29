'use strict';

var ArticleLink = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired
    },

    render () {
        return (
            <a className="article-goto tooltipped btn-floating"
               data-tooltip={I18n.t('js.article.tooltip.link_to')}
               href={"/articles/" + this.props.article.slug} >
                <i className="material-icons">home</i>
            </a>
        );
    }
});

module.exports = ArticleLink;
