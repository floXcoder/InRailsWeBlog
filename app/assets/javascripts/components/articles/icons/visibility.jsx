var ArticleVisibilityIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        userId: React.PropTypes.number
    },

    getDefaultProps: function () {
        return {
            userId: null
        };
    },

    render: function () {
        var visibilityName = I18n.t('js.article.visibility.enum.' + this.props.article.visibility);

        if (this.props.userId) {
            var visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

            if (this.props.article.visibility === 'everyone') {
                return (
                    <div className="article-icons tooltipped hide-on-small-only"
                         data-tooltip={visibilityTooltip}>
                        <i className="material-icons article-public">visibility</i>
                    </div>
                );
            } else {
                return (
                    <div className="article-icons tooltipped hide-on-small-only"
                         data-tooltip={visibilityTooltip}>
                        <i className="material-icons article-private">visibility_off</i>
                    </div>
                );
            }
        } else {
            return null;
        }
    }
});

module.exports = ArticleVisibilityIcon;
