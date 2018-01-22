'use strict';

import {
    Link
} from 'react-router-dom';

const ArticleHistoryIcon = ({articleSlug, isOwner}) => {
    if (!isOwner) {
        return null;
    }

    return (
        <Link className="btn-floating tooltipped article-history"
              to={`/article/${articleSlug}/history`}
              data-tooltip={I18n.t('js.article.tooltip.history')}>
                <span className="material-icons"
                      data-icon="history"
                      aria-hidden="true"/>
        </Link>
    );
};

ArticleHistoryIcon.propTypes = {
    articleSlug: PropTypes.string.isRequired,
    isOwner: PropTypes.bool
};

ArticleHistoryIcon.defaultProps = {
    isOwner: false
};

export default ArticleHistoryIcon;
