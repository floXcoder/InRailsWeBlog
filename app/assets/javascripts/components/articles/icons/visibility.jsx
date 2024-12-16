import React from 'react';
import PropTypes from 'prop-types';

import VisibilityIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOffOutlined';

import I18n from '@js/modules/translations';


function ArticleVisibilityIcon({
                                   articleVisibility,
                                   onVisibilityClick,
                                   size = 'medium',
                                   color = 'primary'
                               }) {
    const isVisible = articleVisibility === 'everyone';

    const visibilityName = I18n.t(`js.article.enums.visibility.${articleVisibility}`);
    const visibilityTooltip = I18n.t('js.article.tooltip.visibility', {visibility: visibilityName});

    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={visibilityTooltip}>
            <a href="#"
               onClick={onVisibilityClick}>
                {
                    isVisible
                        ?
                        <VisibilityIcon color={color}
                                        fontSize={size}/>
                        :
                        <VisibilityOffIcon color={color}
                                           fontSize={size}/>
                }
            </a>
        </span>
    );
}

ArticleVisibilityIcon.propTypes = {
    articleVisibility: PropTypes.string.isRequired,
    onVisibilityClick: PropTypes.func,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

export default React.memo(ArticleVisibilityIcon);
