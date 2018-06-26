'use strict';

const ArticleVisibilityIcon = ({articleId, articleVisibility}) => {
    const isVisible = articleVisibility === 'everyone';

    const visibilityClasses = classNames(
        'article-visibility',
        'tooltip-bottom',
        {
            'article-public': isVisible,
            'article-private': !isVisible
        });

    const visibilityName = I18n.t(`js.article.enums.visibility.${articleVisibility}`);
    const visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

    return (
        <a className={visibilityClasses}
           data-tooltip={visibilityTooltip}>
            <span className="material-icons"
                  data-icon={isVisible ? 'visibility' : 'visibility_off'}
                  aria-hidden="true"/>
        </a>
    );
};

ArticleVisibilityIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleVisibility: PropTypes.string.isRequired
};

export default ArticleVisibilityIcon;
