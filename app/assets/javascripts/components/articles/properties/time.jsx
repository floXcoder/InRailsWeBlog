'use strict';

function ArticleTime({articleDate}) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t('js.article.tooltip.updated_at')}>
            {articleDate}
        </span>
    );
}

ArticleTime.propTypes = {
    articleDate: PropTypes.string.isRequired
};

export default React.memo(ArticleTime);
