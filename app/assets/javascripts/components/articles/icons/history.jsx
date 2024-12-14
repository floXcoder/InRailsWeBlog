import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import HistoryIcon from '@mui/icons-material/HistoryOutlined';

import I18n from '@js/modules/translations';

import {
    historyArticlePath
} from '@js/constants/routesHelper';

function ArticleHistoryIcon({
                                userSlug,
                                articleSlug,
                                size = 'medium',
                                color = 'primary'
                            }) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t('js.article.tooltip.history')}>
            <Link to={historyArticlePath(userSlug, articleSlug)}>
                <HistoryIcon color={color}
                             fontSize={size}/>
            </Link>
        </span>
    );
}

ArticleHistoryIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    articleSlug: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

export default React.memo(ArticleHistoryIcon);
