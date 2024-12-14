import React from 'react';
import PropTypes from 'prop-types';

import I18n from '@js/modules/translations';


function ArticleTime({articleDate}) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t('js.article.tooltip.updated_at')}>
            {articleDate}
        </span>
    );
}

ArticleTime.propTypes = {
    articleDate: PropTypes.string.isRequired
};

export default React.memo(ArticleTime);
