'use strict';

import {FlatButton, FontIcon} from 'material-ui';

const HomePreferenceHeader = ({onPreferenceClick}) => (
    <FlatButton label={I18n.t('js.header.settings.button')}
                className="header-button"
                secondary={true}
                icon={<FontIcon className="material-icons">view_modules</FontIcon>}
                onTouchTap={(event) => HomePreferenceHeader._handlePreferenceClick(onPreferenceClick, event)}/>
);

HomePreferenceHeader.propTypes = {
    onPreferenceClick: React.PropTypes.func.isRequired
};

HomePreferenceHeader._handlePreferenceClick = (onPreferenceClick, event) => {
    event.preventDefault();
    onPreferenceClick();
    return false;
};

export default HomePreferenceHeader;
