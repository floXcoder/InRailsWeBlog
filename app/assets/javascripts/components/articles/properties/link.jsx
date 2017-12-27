'use strict';

import {
    Link
} from 'react-router-dom';

const ArticleLink = ({articleId, articleSlug, onArticleClick}) => (
    <Link className="btn-floating tooltipped article-goto"
          data-tooltip={I18n.t('js.article.tooltip.link_to')}
          to={`/article/${articleSlug}`}
          onClick={_handleArticleClick.bind(undefined, articleId, onArticleClick)}>
        <span className="material-icons"
              data-icon="home"
              aria-hidden="true"/>
    </Link>
);

const _handleArticleClick = (articleId, onArticleClick, event) => {
    // TODO
    // ArticleStore.onTrackClick(articleId);

    if (onArticleClick) {
        onArticleClick(articleId);
    }
};

ArticleLink.propTypes = {
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    onArticleClick: PropTypes.func
};

export default ArticleLink;
