'use strict';

import ArticleStore from '../../../stores/articleStore';

import {Link} from 'react-router';

const ArticleLink = ({article, onArticleClick}) => (
    <Link className="article-goto tooltipped btn-floating"
          data-tooltip={I18n.t('js.article.tooltip.link_to')}
          to={'/article/' + article.slug}
          onClick={ArticleLink._handleArticleClick.bind(article.id, onArticleClick)}>
        <i className="material-icons">home</i>
    </Link>
);

ArticleLink.propTypes = {
    article: React.PropTypes.object.isRequired,
    onArticleClick: React.PropTypes.func
};

ArticleLink.getDefaultProps = {
    onArticleClick: null
};

ArticleLink._handleArticleClick = (articleId, onArticleClick) => {
    ArticleStore.onTrackClick(articleId);

    if (onArticleClick) {
        onArticleClick(articleId);
    }
};

export default ArticleLink;
