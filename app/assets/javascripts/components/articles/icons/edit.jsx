'use strict';

import {
    Link
} from 'react-router-dom';

import IconButton from '@mui/material/IconButton';

import EditIcon from '@mui/icons-material/EditOutlined';

import {
    editArticlePath
} from '../../../constants/routesHelper';

import {
    getScreenPosition
} from '../../../modules/screenPosition';


const _redirectToEdit = (userSlug, articleSlug, routeNavigate, event) => {
    if (routeNavigate) {
        event.preventDefault();

        routeNavigate({
            pathname: editArticlePath(userSlug, articleSlug)
        }, {
            state: {
                position: getScreenPosition()
            }
        });
    }
};

const ArticleEditIcon = function ({
                                      userSlug,
                                      articleSlug,
                                      isIconButton,
                                      routeNavigate,
                                      size,
                                      color
                                  }) {
    return (
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
                        onClick={_redirectToEdit.bind(undefined, userSlug, articleSlug, routeNavigate)}
                        size="large">
                        <EditIcon color={color}
                                  fontSize={size}/>
                    </IconButton>
                    :
                    <Link to={editArticlePath(userSlug, articleSlug)}
                          onClick={_redirectToEdit.bind(undefined, userSlug, articleSlug, routeNavigate)}>
                        <EditIcon color={color}
                                  fontSize={size}/>
                    </Link>
            }
        </span>
    );
};

ArticleEditIcon.propTypes = {
    userSlug: PropTypes.string.isRequired,
    articleSlug: PropTypes.string.isRequired,
    routeNavigate: PropTypes.func,
    isIconButton: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled'])
};

ArticleEditIcon.defaultProps = {
    isIconButton: false,
    size: 'medium',
    color: 'primary'
};

export default React.memo(ArticleEditIcon);
