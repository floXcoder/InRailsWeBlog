import React from 'react';
import PropTypes from 'prop-types';

import LinkOffIcon from '@mui/icons-material/LinkOff';

import I18n from '@js/modules/translations';


function CheckLinkIcon({
                           onCheckLinkClick,
                           size = 'medium',
                           color = 'primary'
                       }) {
    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t('js.article.tooltip.check_link')}>
            <a href="#"
               onClick={onCheckLinkClick}>
               <LinkOffIcon color={color}
                            fontSize={size}/>
            </a>
        </span>
    );
}


CheckLinkIcon.propTypes = {
    onCheckLinkClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

export default React.memo(CheckLinkIcon);
