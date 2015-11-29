'use strict';

var ArticleVisibilityIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        userId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            userId: null
        };
    },

    render () {
        let visibilityName = I18n.t('js.article.visibility.enum.' + this.props.article.visibility);

        if (this.props.userId) {
            let visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

            if (this.props.article.visibility === 'everyone') {
                return (
                    <a className="article-public tooltipped btn-floating"
                         data-tooltip={visibilityTooltip}>
                        <i className="material-icons">visibility</i>
                    </a>
                );
            } else {
                return (
                    <a className="article-private tooltipped btn-floating"
                         data-tooltip={visibilityTooltip}>
                        <i className="material-icons">visibility_off</i>
                    </a>
                );
            }
        } else {
            return null;
        }
    }
});

module.exports = ArticleVisibilityIcon;
