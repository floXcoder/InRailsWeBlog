'use strict';

const ArticleTime = ({articleDate}) => (
    <span className="blog-article-info-date tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.updated_at')}>
        {articleDate}
    </span>
);

ArticleTime.propTypes = {
    articleDate: PropTypes.string.isRequired
};

export default React.memo(ArticleTime);
