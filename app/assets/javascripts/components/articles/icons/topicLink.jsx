import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import ReplyIcon from '@mui/icons-material/Reply';

import I18n from '@js/modules/translations';

import {
    topicArticlesPath
} from '@js/constants/routesHelper';


function ArticleTopicLinkIcon({
                                  userSlug,
                                  topicSlug,
                                  size = 'medium',
                                  color = 'primary'
                              }) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t('js.article.tooltip.topic_link')}>
            <Link to={topicArticlesPath(userSlug, topicSlug)}>
                <ReplyIcon color={color}
                           fontSize={size}/>
            </Link>
        </span>
    );
}

ArticleTopicLinkIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    topicSlug: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

export default React.memo(ArticleTopicLinkIcon);
