'use strict';

import {
    Link
} from 'react-router-dom';

import IconButton from '@material-ui/core/IconButton';

import EditIcon from '@material-ui/icons/EditOutlined';

import {
    editArticlePath
} from '../../../constants/routesHelper';

const ArticleEditIcon = ({userSlug, articleSlug, isIconButton, history, size, color}) => (
    <span className="flow-tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.edit')}>
        {
            isIconButton
                ?
                <IconButton
                    aria-label="more"
                    aria-controls="article-language-select"
                    aria-haspopup="true"
                    component={Link}
                    to={editArticlePath(userSlug, articleSlug)}
                    onClick={_redirectToEdit.bind(undefined, userSlug, articleSlug, history)}>
                    <EditIcon color={color}
                              fontSize={size}/>
                </IconButton>
                :
                <Link to={editArticlePath(userSlug, articleSlug)}
                      onClick={_redirectToEdit.bind(undefined, userSlug, articleSlug, history)}>
                    <EditIcon color={color}
                              fontSize={size}/>
                </Link>
        }

    </span>
);

const _redirectToEdit = (userSlug, articleSlug, history, event) => {
    if (history) {
        event.preventDefault();

        history.push({
            pathname: editArticlePath(userSlug, articleSlug),
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
    isIconButton: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled'])
};

ArticleEditIcon.defaultProps = {
    isIconButton: false,
    size: 'default',
    color: 'primary'
};

export default React.memo(ArticleEditIcon);
