'use strict';

var ArticleStore = require('../../../stores/articleStore');

var ArticleLink = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onArticleClick: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            onArticleClick: null
        };
    },

    _handleArticleClick (articleId, event) {
        ArticleStore.onTrackClick(articleId);

        if (this.props.onArticleClick) {
            this.props.onArticleClick(articleId);
        }

        return event;
    },

    render () {
        return (
            <a className="article-goto tooltipped btn-floating"
               data-tooltip={I18n.t('js.article.tooltip.link_to')}
               href={'/articles/' + this.props.article.slug}
               onClick={this._handleArticleClick.bind(this, this.props.article.id)}>
                <i className="material-icons">home</i>
            </a>
        );
    }
});

module.exports = ArticleLink;
