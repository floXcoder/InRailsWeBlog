'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

const ArticleLinkIcon = ({articleSlug, articleId, articleTitle}) => (
    <Link className="article-link tooltipped"
          to={`/article/${articleSlug}`}
          data-tooltip={I18n.t('js.article.tooltip.link_to')}
          onClick={spyTrackClick.bind(null, 'article', articleId, articleSlug, articleTitle)}>
        <span className="material-icons"
              data-icon="open_in_new"
              aria-hidden="true"/>
    </Link>
);

ArticleLinkIcon.propTypes = {
    articleSlug: PropTypes.string.isRequired,
    articleId: PropTypes.number.isRequired,
    articleTitle: PropTypes.string
};

export default ArticleLinkIcon;
