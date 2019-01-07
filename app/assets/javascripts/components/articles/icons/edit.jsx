'use strict';

import {
    Link
} from 'react-router-dom';

import EditIcon from '@material-ui/icons/EditOutlined';

const ArticleEditIcon = ({userSlug, articleSlug, size, color, onMouseEnter, onMouseLeave, onClick}) => (
    <span className="tooltip-bottom"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
          data-tooltip={I18n.t('js.article.tooltip.edit')}>
        <Link to={`/users/${userSlug}/articles/${articleSlug}/edit`}>
            <EditIcon color={color}
                      fontSize={size}/>
        </Link>
    </span>
);

ArticleEditIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    articleSlug: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action']),
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onClick: PropTypes.func
};

ArticleEditIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default ArticleEditIcon;
