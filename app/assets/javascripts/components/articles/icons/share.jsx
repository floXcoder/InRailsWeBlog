'use strict';

import {
    Link
} from 'react-router-dom';

import ShareIcon from '@material-ui/icons/Share';

import {
    shareArticleParam
} from '../../../constants/routesHelper';

const ArticleShareIcon = ({articleId, size, color}) => (
    <span className="tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.share')}>
        <Link to={{
            hash: '#' + shareArticleParam,
            state: {
                articleId
            }
        }}>
            <ShareIcon color={color}
                       fontSize={size}/>
        </Link>
    </span>
);


ArticleShareIcon.propTypes = {
    articleId: PropTypes.number.isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action']),
};

ArticleShareIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default React.memo(ArticleShareIcon);
