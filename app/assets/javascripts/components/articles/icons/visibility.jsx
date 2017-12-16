'use strict';

// TODO: use connect for article visibility and user connected
const ArticleVisibilityIcon = ({articleId, articleVisibility, isUserConnected, hasFloatingButton}) => {
    if (!isUserConnected) {
        return null;
    }

    let isVisible = articleVisibility === 'everyone';

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

    let visibilityName = I18n.t('js.article.enums.visibility.' + articleVisibility);
    let visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

    return (
        <a className={visibilityClasses}
           data-tooltip={visibilityTooltip}>
            <i className="material-icons">{isVisible ? 'visibility' : 'visibility_off'}</i>
        </a>
    );
};

ArticleVisibilityIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleVisibility: PropTypes.string.isRequired,
    isUserConnected: PropTypes.bool,
    hasFloatingButton: PropTypes.bool
};

ArticleVisibilityIcon.defaultProps = {
    isUserConnected: false,
    hasFloatingButton: false
};

export default ArticleVisibilityIcon;
