'use strict';

const classNames = require('classnames');

var ArticleVisibilityIcon = ({article, hasFloatingButton}) => {
    let isVisible = article.visibility === 'everyone';

    let visibilityClasses = classNames(
        'article-visibility',
        'tooltipped',
        {
            'btn-floating': hasFloatingButton
        },
        {
            'article-public': isVisible,
            'article-private': !isVisible
        });

    let visibilityName = I18n.t('js.article.enums.visibility.' + article.visibility);
    let visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

    if ($app.user.isConnected(article.author.id)) {
        return (
            <a className={visibilityClasses}
               data-tooltip={visibilityTooltip}>
                <i className="material-icons">{isVisible ? 'visibility' : 'visibility_off'}</i>
            </a>
        );
    } else {
        return null;
    }
};

ArticleVisibilityIcon.propTypes = {
    article: React.PropTypes.object.isRequired,
    hasFloatingButton: React.PropTypes.bool
};

ArticleVisibilityIcon.getDefaultProps = {
    hasFloatingButton: false
};

module.exports = ArticleVisibilityIcon;
