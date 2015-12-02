'use strict';

var classNames = require('classnames');

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
        if (this.props.userId) {
            let visibilityClasses = classNames(
                'article-visibility',
                'tooltipped',
                'btn-floating',
                {
                    'article-public': this.props.article.visibility === 'everyone',
                    'article-private': this.props.article.visibility !== 'everyone'
                });
            let visibilityName = I18n.t('js.article.visibility.enum.' + this.props.article.visibility);
            let visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

            return (
                <a className={visibilityClasses}
                   data-tooltip={visibilityTooltip}>
                    <i className="material-icons">visibility_off</i>
                </a>
            );
        } else {
            return null;
        }
    }
});

module.exports = ArticleVisibilityIcon;
