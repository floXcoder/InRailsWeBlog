'use strict';

const ArticleLinkIcon = ({isLink}) => {
    if (!isLink) {
        return null;
    }

    return (
        <div className="btn-floating tooltipped article-link"
             data-tooltip={I18n.t('js.article.tooltip.link')}>
                <span className="material-icons"
                      data-icon="link"
                      aria-hidden="true"/>
        </div>
    );
};

ArticleLinkIcon.propTypes = {
    isLink: PropTypes.bool
};

ArticleLinkIcon.defaultProps = {
    isLink: false
};

export default ArticleLinkIcon;
