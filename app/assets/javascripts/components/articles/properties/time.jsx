'use strict';

const ArticleTime = ({article}) => (
    <div className="tooltipped article-time"
         data-tooltip={I18n.t('js.article.tooltip.updated_at')}>
        {article.updated_at}
    </div>
);

ArticleTime.propTypes = {
    article: React.PropTypes.object.isRequired
};

export default ArticleTime;
