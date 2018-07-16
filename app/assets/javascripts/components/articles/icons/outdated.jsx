'use strict';

const ArticleOutdatedIcon = ({articleId, isOutdated, onOutdatedClick}) => {
    const outdatedTooltip = isOutdated ? I18n.t('js.article.tooltip.remove_outdated') : I18n.t('js.article.tooltip.add_outdated');
    const outdatedIcon = isOutdated ? 'highlight_off' : 'highlight_off';

    return (
        <a className="article-outdate tooltip-bottom"
           data-tooltip={outdatedTooltip}
           onClick={onOutdatedClick}>
            <span className={classNames('material-icons', {'article-outdate-icon': isOutdated})}
                  data-icon={outdatedIcon}
                  aria-hidden="true"/>
        </a>
    );
};

ArticleOutdatedIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    isOutdated: PropTypes.bool.isRequired,
    onOutdatedClick: PropTypes.func.isRequired
};

export default ArticleOutdatedIcon;
