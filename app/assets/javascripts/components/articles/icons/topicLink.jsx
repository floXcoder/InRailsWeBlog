'use strict';

import {
    Link
} from 'react-router-dom';

import ReplyIcon from '@material-ui/icons/Reply';

import {
    topicArticlesPath
} from '../../../constants/routesHelper';

const ArticleTopicLinkIcon = ({userSlug, topicSlug, size, color}) => (
    <span className="flow-tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.topic_link')}>
        <Link to={topicArticlesPath(userSlug, topicSlug)}>
            <ReplyIcon color={color}
                       fontSize={size}/>
        </Link>
    </span>
);

ArticleTopicLinkIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    topicSlug: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

ArticleTopicLinkIcon.defaultProps = {
    size: 'medium',
    color: 'primary'
};

export default React.memo(ArticleTopicLinkIcon);
