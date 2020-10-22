'use strict';

import LinkOffIcon from '@material-ui/icons/LinkOff';

const CheckLinkIcon = ({onCheckLinkClick, size, color}) => (
    <span className="flow-tooltip-bottom"
          data-tooltip={I18n.t('js.article.tooltip.check_link')}>
        <a href="#"
           onClick={onCheckLinkClick}>
           <LinkOffIcon color={color}
                       fontSize={size}/>
        </a>
    </span>
);


CheckLinkIcon.propTypes = {
    onCheckLinkClick: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled']),
};

CheckLinkIcon.defaultProps = {
    size: 'default',
    color: 'primary'
};

export default React.memo(CheckLinkIcon);
