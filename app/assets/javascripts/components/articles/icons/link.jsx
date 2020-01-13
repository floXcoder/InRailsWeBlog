'use strict';

import {
    Link
} from 'react-router-dom';

import AssignmentIcon from '@material-ui/icons/AssignmentOutlined';

import {
    userArticlePath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

const ArticleLinkIcon = ({userSlug, articleSlug, articleId, articleTitle, size, color}) => (
    <span className="tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.link_to')}>
        <Link to={userArticlePath(userSlug, articleSlug)}
              onClick={spyTrackClick.bind(null, 'article', articleId, articleSlug, articleTitle)}>
            <AssignmentIcon color={color}
                            fontSize={size}/>
        </Link>
    </span>
);

ArticleLinkIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    articleSlug: PropTypes.string.isRequired,
    articleId: PropTypes.number.isRequired,
    articleTitle: PropTypes.string,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action']),
};

ArticleLinkIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default React.memo(ArticleLinkIcon);
