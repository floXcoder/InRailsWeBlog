'use strict';

import {FlatButton, FontIcon} from 'material-ui';

const HomeSearchHeader = ({onSearchClick}) => (
    <FlatButton label={I18n.t('js.header.search.button')}
                className="header-button"
                secondary={true}
                icon={<FontIcon className="material-icons">search</FontIcon>}
                onTouchTap={(event) => HomeSearchHeader._handleSearchClick(onSearchClick, event)}/>
);

HomeSearchHeader.propTypes = {
    onSearchClick: React.PropTypes.func.isRequired
};

HomeSearchHeader._handleSearchClick = (onSearchClick, event) => {
    event.preventDefault();
    onSearchClick();
    return false;
};

export default HomeSearchHeader;
