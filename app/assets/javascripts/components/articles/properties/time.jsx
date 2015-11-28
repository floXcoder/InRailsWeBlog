'use strict';

var ArticleTime = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired
    },

    render () {
        return (
            <div className="article-icons tooltipped article-time"
                 data-tooltip={I18n.t('js.article.tooltip.updated_at')}>
                {this.props.article.updated_at}
            </div>
        );
    }
});

module.exports = ArticleTime;
