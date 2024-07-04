'use strict';

import {
    Link
} from 'react-router-dom';

import ExploreIcon from '@mui/icons-material/Explore';

import {
    trackingArticleParam
} from '../../../constants/routesHelper';


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
