'use strict';

import IconButton from '@mui/material/IconButton';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Dropdown from '../../theme/dropdown';

import HeaderUserMenu from './menus/user';


const HomeUserHeader = function ({userSlug, onLogoutClick, onPreferenceClick, isAdminConnected}) {
    return (
        <Dropdown button={
            <IconButton color="default"
                        itemProp="url"
                        size="large">
                <AccountCircleIcon/>
            </IconButton>
        }
                  position="bottom right"
                  buttonClassName="layout-header-headerButton"
                  isFixed={true}
                  hasWavesEffect={false}
                  hasArrow={true}>
            <HeaderUserMenu isAdminConnected={isAdminConnected}
                            userSlug={userSlug}
                            onPreferenceClick={onPreferenceClick}
                            onLogoutClick={onLogoutClick}/>
        </Dropdown>
    );
};

HomeUserHeader.propTypes = {
    userSlug: PropTypes.string.isRequired,
    onLogoutClick: PropTypes.func.isRequired,
    onPreferenceClick: PropTypes.func.isRequired,
    isAdminConnected: PropTypes.bool
};

export default React.memo(HomeUserHeader);
