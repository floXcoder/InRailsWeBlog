'use strict';

import {
    Link
} from 'react-router-dom';

const ArticleEditIcon = ({articleSlug, onEdit}) => (
    <Link className="article-edit tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.edit')}
          to={`/article/${articleSlug}/edit`}>
            <span className="material-icons"
                  data-icon="mode_edit"
                  aria-hidden="true"/>
    </Link>
);

ArticleEditIcon.propTypes = {
    articleSlug: PropTypes.string.isRequired,
    onEdit: PropTypes.func
};

export default ArticleEditIcon;
