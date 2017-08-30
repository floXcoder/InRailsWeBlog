'use strict';

// TODO: use connect for article visibility and user connected
const ArticleVisibilityIcon = ({hasFloatingButton}) => {
    // let isVisible = article.visibility === 'everyone';
    let isVisible = true;

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

    // let visibilityName = I18n.t('js.article.enums.visibility.' + article.visibility);
    // let visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

    // TODO: use user global state
    // if ($app.isUserConnected(article.user.id)) {
    //     return (
    //         <a className={visibilityClasses}
    //            data-tooltip={visibilityTooltip}>
    //             <i className="material-icons">{isVisible ? 'visibility' : 'visibility_off'}</i>
    //         </a>
    //     );
    // } else {
        return null;
    // }
};

ArticleVisibilityIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    hasFloatingButton: PropTypes.bool
};

ArticleVisibilityIcon.getDefaultProps = {
    hasFloatingButton: false
};

export default ArticleVisibilityIcon;
