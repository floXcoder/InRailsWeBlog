import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import IconButton from '@mui/material/IconButton';

import EditIcon from '@mui/icons-material/EditOutlined';

import I18n from '@js/modules/translations';

import {
    editArticlePath
} from '@js/constants/routesHelper';

import {
    getScreenPosition
} from '@js/modules/screenPosition';


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
                                      isIconButton = false,
                                      routeNavigate,
                                      size = 'medium',
                                      color = 'primary'
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

export default React.memo(ArticleEditIcon);
