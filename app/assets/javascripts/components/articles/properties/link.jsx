'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

const ArticleLink = ({userSlug, articleId, articleSlug, articleTitle, onArticleClick}) => (
    <Link className="btn-floating tooltip-bottom article-goto"
          data-tooltip={I18n.t('js.article.tooltip.link_to')}
          to={`/users/${userSlug}/articles/${articleSlug}`}
          onClick={_handleArticleClick.bind(null, articleId, articleSlug, articleTitle, onArticleClick)}>
        <span className="material-icons"
              data-icon="home"
              aria-hidden="true"/>
    </Link>
);

const _handleArticleClick = (articleId, articleSlug, articleTitle, onArticleClick) => {
    spyTrackClick('article', articleId, articleSlug, articleTitle);

    if (onArticleClick) {
        onArticleClick(articleId);
    }
};

ArticleLink.propTypes = {
    userSlug: PropTypes.string.isRequired,
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    articleTitle: PropTypes.string,
    onArticleClick: PropTypes.func
};

export default React.memo(ArticleLink);
