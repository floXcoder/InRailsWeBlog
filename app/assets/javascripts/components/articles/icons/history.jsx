'use strict';

const ArticleHistoryIcon = ({article, onHistoryClick, isUserConnected}) => {
    if (!isUserConnected) {
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
    article: PropTypes.object.isRequired,
    onHistoryClick: PropTypes.func.isRequired,
    isUserConnected: PropTypes.bool
};

ArticleHistoryIcon.defaultProps = {
    isUserConnected: false
};

export default ArticleHistoryIcon;
