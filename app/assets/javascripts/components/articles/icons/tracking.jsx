import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import ExploreIcon from '@mui/icons-material/Explore';

import I18n from '@js/modules/translations';

import {
    trackingArticleParam
} from '@js/constants/routesHelper';


function ArticleTrackingIcon({
                                 articleId,
                                 size = 'medium',
                                 color = 'primary'
                             }) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t('js.article.tooltip.tracking')}>
            <Link to={{
                hash: '#' + trackingArticleParam
            }}
                  state={articleId}>
                <ExploreIcon color={color}
                             fontSize={size}/>
            </Link>
        </span>
    );
}


ArticleTrackingIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

export default React.memo(ArticleTrackingIcon);
