'use strict';

var classNames = require('classnames');

var ArticleVisibilityIcon = React.createClass({
    propTypes: {
        article: React.PropTypes.object.isRequired,
        floatingButton: React.PropTypes.bool
        //currentUserId: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            floatingButton: false
            //currentUserId: null
        };
    },

    render () {
        let isVisible =  this.props.article.visibility === 'everyone';

        let visibilityClasses = classNames(
            'article-visibility',
            'tooltipped',
            {
                'btn-floating': this.props.floatingButton
            },
            {
                'article-public': isVisible,
                'article-private': !isVisible
            });

        let visibilityName = I18n.t('js.article.visibility.enum.' + this.props.article.visibility);
        let visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

        if (!isVisible) {
            return (
                <a className={visibilityClasses}
                   data-tooltip={visibilityTooltip}>
                    <i className="material-icons">visibility_off</i>
                </a>
            );
        } else {
            return (
                <a className={visibilityClasses}
                   data-tooltip={visibilityTooltip}>
                    <i className="material-icons">visibility</i>
                </a>
            );
        }
    }
});

module.exports = ArticleVisibilityIcon;
