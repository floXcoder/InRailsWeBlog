'use strict';

const ArticleHistoryIcon = ({onHistoryClick, isOwner}) => {
    if (!isOwner) {
        return null;
    }

    return (
        <a className="btn-floating tooltipped article-history"
           data-tooltip={I18n.t('js.article.tooltip.history')}
           onClick={onHistoryClick}>
                <span className="material-icons"
                      data-icon="history"
                      aria-hidden="true"/>
        </a>
    );
};

ArticleHistoryIcon.propTypes = {
    onHistoryClick: PropTypes.func.isRequired,
    isOwner: PropTypes.bool
};

ArticleHistoryIcon.defaultProps = {
    isOwner: false
};

export default ArticleHistoryIcon;
