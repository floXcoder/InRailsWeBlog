'use strict';

import {
    Link
} from 'react-router-dom';

const ArticleHistoryIcon = ({articleSlug}) => (
    <Link className="article-history tooltipped"
          to={`/article/${articleSlug}/history`}
          data-tooltip={I18n.t('js.article.tooltip.history')}>
        <span className="material-icons"
              data-icon="history"
              aria-hidden="true"/>
    </Link>
);

ArticleHistoryIcon.propTypes = {
    articleSlug: PropTypes.string.isRequired
};

export default ArticleHistoryIcon;
