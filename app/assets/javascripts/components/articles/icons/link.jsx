import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';

import I18n from '@js/modules/translations';

import {
    userArticlePath
} from '@js/constants/routesHelper';

import {
    spyTrackClick
} from '@js/actions/metricsActions';


function ArticleLinkIcon({
                             userSlug,
                             articleId,
                             articleSlug,
                             articleUserId,
                             articleTitle,
                             articleTopicId,
                             size = 'medium',
                             color = 'primary'
                         }) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t('js.article.tooltip.link_to')}>
            <Link to={userArticlePath(userSlug, articleSlug)}
                  onClick={spyTrackClick.bind(null, 'article', articleId, articleSlug, articleUserId, articleTitle, articleTopicId)}>
                <AssignmentIcon color={color}
                                fontSize={size}/>
            </Link>
        </span>
    );
}

ArticleLinkIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    articleId: PropTypes.number.isRequired,
    articleSlug: PropTypes.string.isRequired,
    articleUserId: PropTypes.number.isRequired,
    articleTopicId: PropTypes.number.isRequired,
    articleTitle: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

export default React.memo(ArticleLinkIcon);
