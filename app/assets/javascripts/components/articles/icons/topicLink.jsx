'use strict';

import {
    Link
} from 'react-router-dom';

import ReplyIcon from '@material-ui/icons/Reply';

const ArticleTopicLinkIcon = ({userSlug, topicSlug, size, color}) => (
    <span className="tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.topic_link')}>
        <Link to={`/users/${userSlug}/topics/${topicSlug}`}>
            <ReplyIcon color={color}
                       fontSize={size}/>
        </Link>
    </span>
);

ArticleTopicLinkIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    topicSlug: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action']),
};

ArticleTopicLinkIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default React.memo(ArticleTopicLinkIcon);
