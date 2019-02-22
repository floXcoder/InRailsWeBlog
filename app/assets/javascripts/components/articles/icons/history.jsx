'use strict';

import {
    Link
} from 'react-router-dom';

import HistoryIcon from '@material-ui/icons/HistoryOutlined';

const ArticleHistoryIcon = ({userSlug, articleSlug, size, color}) => (
    <span className="tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.history')}>
        <Link to={`/users/${userSlug}/articles/${articleSlug}/history`}>
            <HistoryIcon color={color}
                         fontSize={size}/>
        </Link>
    </span>
);

ArticleHistoryIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    articleSlug: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action']),
};

ArticleHistoryIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default React.memo(ArticleHistoryIcon);
