import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Dropdown from '@js/components/theme/dropdown';

import HeaderUserMenu from '@js/components/layouts/header/menus/user';


const HomeUserHeader = function ({
                                     userSlug,
                                     onLogoutClick,
                                     onPreferenceClick,
                                     onClearPwaCache,
                                     isAdminConnected
                                 }) {
    return (
        <Dropdown id="header-user"
                  buttonClassName="layout-header-headerButton"
                  button={
                      <IconButton color="default"
                                  itemProp="url"
                                  size="large">
                          <AccountCircleIcon/>
                      </IconButton>
                  }>
            <HeaderUserMenu isAdminConnected={isAdminConnected}
                            userSlug={userSlug}
                            onPreferenceClick={onPreferenceClick}
                            onClearPwaCache={onClearPwaCache}
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
