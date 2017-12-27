'use strict';

const ArticleLinkIcon = ({isLink}) => {
    if (isLink) {
        return (
            <div className="btn-floating tooltipped article-link"
                 data-tooltip={I18n.t('js.article.tooltip.link')}>
                <span className="material-icons"
                      data-icon="link"
                      aria-hidden="true"/>
            </div>
        );
    } else {
        return null;
    }
};

ArticleLinkIcon.propTypes = {
    isLink: PropTypes.bool.isRequired
};

export default ArticleLinkIcon;
