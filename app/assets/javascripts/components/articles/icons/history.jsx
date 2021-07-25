'use strict';

import {
    Link
} from 'react-router-dom';

import HistoryIcon from '@material-ui/icons/HistoryOutlined';

import {
    historyArticlePath
} from '../../../constants/routesHelper';

const ArticleHistoryIcon = ({userSlug, articleSlug, size, color}) => (
    <span className="flow-tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.history')}>
        <Link to={historyArticlePath(userSlug, articleSlug)}>
            <HistoryIcon color={color}
                         fontSize={size}/>
        </Link>
    </span>
);

ArticleHistoryIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    articleSlug: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

ArticleHistoryIcon.defaultProps = {
    size: 'medium',
    color: 'primary'
};

export default React.memo(ArticleHistoryIcon);
