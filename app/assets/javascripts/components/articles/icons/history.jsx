"use strict";

var ArticleHistoryIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onClickHistory: React.PropTypes.func.isRequired,
        userId: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            userId: null
        };
    },

    render: function () {
        if (this.props.userId && this.props.userId === this.props.article.author.id) {
            var historyTooltip = I18n.t('js.article.tooltip.history');

            return (
                <div className="article-icons tooltipped"
                     data-tooltip={historyTooltip}
                     onClick={this.props.onClickHistory}>
                    <i className="material-icons article-history">history</i>
                </div>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleHistoryIcon;
