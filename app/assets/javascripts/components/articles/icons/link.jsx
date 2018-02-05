'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

const ArticleLinkIcon = ({articleSlug, articleId}) => (
    <Link className="article-link tooltipped"
          to={`/article/${articleSlug}`}
          data-tooltip={I18n.t('js.article.tooltip.link_to')}
          onClick={spyTrackClick.bind(null, 'article', articleId)}>
        <span className="material-icons"
              data-icon="open_in_new"
              aria-hidden="true"/>
    </Link>
);

ArticleLinkIcon.propTypes = {
    articleSlug: PropTypes.string.isRequired,
    articleId: PropTypes.number.isRequired
};

export default ArticleLinkIcon;
