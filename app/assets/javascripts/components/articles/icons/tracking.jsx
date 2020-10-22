'use strict';

import {
    Link
} from 'react-router-dom';

import ExploreIcon from '@material-ui/icons/Explore';

import {
    trackingArticleParam
} from '../../../constants/routesHelper';

const ArticleTrackingIcon = ({articleId, size, color}) => (
    <span className="flow-tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.tracking')}>
        <Link to={{
            hash: '#' + trackingArticleParam,
            state: {
                articleId
            }
        }}>
            <ExploreIcon color={color}
                         fontSize={size}/>
        </Link>
    </span>
);


ArticleTrackingIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

ArticleTrackingIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default React.memo(ArticleTrackingIcon);
