'use strict';

var ArticleHistoryIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onHistoryClick: React.PropTypes.func.isRequired
    },

    getDefaultProps () {
        return {
        };
    },

    componentDidMount () {
        $('.article-history.tooltipped').tooltip();
    },

    componentWillUpdate () {
        $('.article-history.tooltipped').tooltip('remove');
    },

    componentDidUpdate () {
        $('.article-history.tooltipped').tooltip();
    },

    render () {
        if ($app.user.isConnected(this.props.article.author.id)) {
            var historyTooltip = I18n.t('js.article.tooltip.history');

            return (
                <a className="article-history tooltipped btn-floating"
                     data-tooltip={historyTooltip}
                     onClick={this.props.onHistoryClick}>
                    <i className="material-icons">history</i>
                </a>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleHistoryIcon;
