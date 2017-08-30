'use strict';

const ArticleTime = ({lastUpdate}) => (
    <div className="tooltipped article-time"
         data-tooltip={I18n.t('js.article.tooltip.updated_at')}>
        {lastUpdate}
    </div>
);

ArticleTime.propTypes = {
    lastUpdate: PropTypes.string.isRequired
};

export default ArticleTime;
