'use strict';

const ArticleLinkIcon = ({isLink}) => {
    if (isLink) {
        return (
            <div className="article-link tooltipped btn-floating"
                 data-tooltip={I18n.t('js.article.tooltip.link')}>
                <i className="material-icons">link</i>
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
