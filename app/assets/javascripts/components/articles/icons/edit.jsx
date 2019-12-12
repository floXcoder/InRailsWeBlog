'use strict';

import {
    Link
} from 'react-router-dom';

import EditIcon from '@material-ui/icons/EditOutlined';

const ArticleEditIcon = ({userSlug, articleSlug, history, size, color}) => (
    <span className="tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.edit')}>
        <Link to={`/users/${userSlug}/articles/${articleSlug}/edit`}
              onClick={_redirectToEdit.bind(undefined, userSlug, articleSlug, history)}>
            <EditIcon color={color}
                      fontSize={size}/>
        </Link>
    </span>
);

const _redirectToEdit = (userSlug, articleSlug, history, event) => {
    if (history) {
        event.preventDefault();

        history.push({
            pathname: `/users/${userSlug}/articles/${articleSlug}/edit`,
            state: {
                position: _getScreenPosition()
            }
        });
    }
};

const _getScreenPosition = () => {
    const doc = document.documentElement;
    const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    return {
        left,
        top
    }
};

ArticleEditIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    articleSlug: PropTypes.string.isRequired,
    history: PropTypes.object,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action'])
};

ArticleEditIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default React.memo(ArticleEditIcon);
