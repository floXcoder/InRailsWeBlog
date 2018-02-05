'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

const ArticleLink = ({articleId, articleSlug, onArticleClick}) => (
    <Link className="btn-floating tooltipped article-goto"
          data-tooltip={I18n.t('js.article.tooltip.link_to')}
          to={`/article/${articleSlug}`}
          onClick={_handleArticleClick.bind(null, articleId, onArticleClick)}>
        <span className="material-icons"
              data-icon="home"
              aria-hidden="true"/>
    </Link>
);

const _handleArticleClick = (articleId, onArticleClick) => {
    spyTrackClick('article', this.props.article.id);

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
