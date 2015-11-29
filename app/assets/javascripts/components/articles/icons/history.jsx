'use strict';

var ArticleHistoryIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        onClickHistory: React.PropTypes.func.isRequired,
        userId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            userId: null
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
        if (this.props.userId && this.props.userId === this.props.article.author.id) {
            var historyTooltip = I18n.t('js.article.tooltip.history');

            return (
                <a className="article-history tooltipped btn-floating"
                     data-tooltip={historyTooltip}
                     onClick={this.props.onClickHistory}>
                    <i className="material-icons">history</i>
                </a>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleHistoryIcon;
